import { Delta } from 'jsondiffpatch'
import deepCopy from 'general/deepCopy'

type PatchUnpatchResult = {
  scrollTop: number
  delta: Delta
}

class DeltaNode {
  delta: Delta
  scrollTop: number
  nextNode: DeltaNode | undefined
  prevNode: DeltaNode | undefined

  constructor(delta: Delta, scrollTop: number) {
    this.delta = delta
    this.scrollTop = scrollTop
  }
}

const MAX_SIZE = 100
class DeltasStack {
  startNode?: DeltaNode = undefined
  pointerNode?: DeltaNode = undefined
  size: number = 0
  canUnpatch: boolean = false
  canPatch: boolean = false

  getNextResultToUnpatch(): PatchUnpatchResult | null {
    if (!this.canUnpatch) {
      return null
    }

    if (!this.pointerNode) {
      this.pointerNode = this.startNode
    } else {
      this.pointerNode = this.pointerNode.nextNode
    }

    if (this.pointerNode) {
      const { delta, scrollTop } = this.pointerNode
      this.canUnpatch = this.pointerNode.nextNode !== undefined
      this.canPatch = true

      // jsondiffpatch sometimes modifies this delta for some reason
      return {
        delta: deepCopy(delta),
        scrollTop,
      }
    }

    this.canUnpatch = false

    return null
  }

  getNextResultToPatch(): PatchUnpatchResult | null {
    if (this.pointerNode) {
      const { delta, scrollTop } = this.pointerNode
      this.pointerNode = this.pointerNode.prevNode

      this.canPatch = this.pointerNode !== undefined
      this.canUnpatch = true

      return {
        delta: deepCopy(delta),
        scrollTop,
      }
    }

    return null
  }

  keepOnlyLast(n: number) {
    let node: DeltaNode | undefined = this.startNode
    let index = 0

    while (node) {
      if (index + 1 === n) {
        this.size = n
        node.nextNode = undefined
        break
      }

      node = node.nextNode
      index++
    }
  }

  push(delta: Delta, scrollTop: number) {
    if (this.pointerNode) {
      this.startNode = this.pointerNode.nextNode
      this.pointerNode = undefined
    }

    const node = new DeltaNode(delta, scrollTop)

    if (!this.startNode) {
      this.startNode = node
    } else {
      node.nextNode = this.startNode
      this.startNode.prevNode = node
      this.startNode = node
    }

    this.size++

    if (this.size >= MAX_SIZE) {
      this.keepOnlyLast(Math.floor(MAX_SIZE / 2))
    }

    this.canUnpatch = true
    this.canPatch = false
  }
}

export default DeltasStack