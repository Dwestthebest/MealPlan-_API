import { Flex, IconButton, Box } from '@chakra-ui/react'
import { VariantsFieldArray } from 'core/diets'
import VariantItem from './VariantItem'
import { Plus } from 'react-feather'
import { Droppable } from 'react-beautiful-dnd'
import VariantNameModal from './VariantNameModal'
import { useRemoveVariantForm, useReorderVariantsForms } from 'core/diets'
import useVariantActions from './useVariantActions'

type Props = {
  variantsFieldArray: VariantsFieldArray
}

function VariantsList({ variantsFieldArray }: Props) {
  const removeVariantForm = useRemoveVariantForm({ variantsFieldArray })
  const variantActions = useVariantActions({ variantsFieldArray })

  useReorderVariantsForms({ variantsFieldArray })

  const { variantsFields } = variantsFieldArray

  return (
    <Droppable
      droppableId="variantsList"
      type="variantsList"
      direction="horizontal"
    >
      {(provided, snapshot) => (
        <Flex ref={provided.innerRef}>
          {variantsFields.map((variantField, index) => {
            return (
              <VariantItem
                canRemove={variantsFields.length > 1}
                mr={1}
                index={index}
                onDelete={removeVariantForm.onRemove}
                onEditName={variantActions.onRename}
                onClone={variantActions.onClone}
                key={variantField.fieldId}
                variantField={variantField}
                isSelected={
                  index === variantsFieldArray.selectedVariantFormIndex
                }
                onSelect={() =>
                  variantsFieldArray.setSelectedVariantFormIndex(index)
                }
              >
                {variantField.name}
              </VariantItem>
            )
          })}

          {provided.placeholder}

          <Flex
            ml={2}
            opacity={snapshot.isUsingPlaceholder ? 0 : 1}
            transition="140ms opacity ease-out"
          >
            <IconButton
              borderRadius="full"
              size="sm"
              aria-label="Add variant"
              icon={<Plus size={20} pointerEvents="none" />}
              variant="outline"
              onClick={variantActions.onAppend}
            />
            <Box width={3} height={3} />
          </Flex>

          <VariantNameModal
            title={variantActions.modalTitle}
            isOpen={variantActions.isModalOpen}
            onClose={variantActions.onModalClose}
            onSave={variantActions.onModalSave}
            existingVariantsNames={variantActions.existingVariantsNames}
          />
        </Flex>
      )}
    </Droppable>
  )
}

export default VariantsList
