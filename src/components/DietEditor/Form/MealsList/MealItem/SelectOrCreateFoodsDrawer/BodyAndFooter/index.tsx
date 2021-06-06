import {
  DrawerBody,
  DrawerFooter,
  Button,
  Flex,
  VStack,
} from '@chakra-ui/react'
import { FoodsList } from 'components/foods'
import { useUserFoodsState } from 'core/foods'
import { Food } from 'core/types'
import useSelection from 'core/utils/useSelection'
import SelectedFoodsList from './SelectedFoodsList'
import ActionTypeOptions, { ActionType } from './ActionTypeOptions'
import { RefObject, useState } from 'react'
import { CreateOrEditFoodFields } from 'components/foods'
import { getFoodForm, useFoodForm } from 'core/foodForm'
import { FormProvider } from 'react-hook-form'

type Props = {
  onClose: () => void
  searchInputRef: RefObject<HTMLInputElement>
  onSave: (foods: Food[]) => void
}

function BodyAndFooter({ onClose, onSave, searchInputRef }: Props) {
  const selection = useSelection<Food>()
  const foods = useUserFoodsState()
  const [actionType, setActionType] = useState<ActionType>('selectFoods')
  const formMethods = useFoodForm(getFoodForm())

  const { handleSubmit } = formMethods

  const onSubmit = handleSubmit(form => {
    console.log('f', form)
  })

  function onSaveButtonClick() {
    if (actionType === 'selectFoods') {
      const selectedFoods: Food[] = foods.filter(food =>
        selection.isIdSelected(food.id)
      )

      onSave(selectedFoods)
    } else {
      onSubmit()
    }
  }

  return (
    <>
      <DrawerBody>
        <Flex width="100%" height="100%" flexDirection="column">
          <ActionTypeOptions
            actionType={actionType}
            onActionChange={setActionType}
          />

          {actionType === 'selectFoods' ? (
            <VStack
              flex={1}
              mt={3}
              spacing={3}
              flexDirection="column"
              alignItems="stretch"
            >
              <SelectedFoodsList selection={selection} />
              <FoodsList
                searchInputRef={searchInputRef}
                selection={selection}
                flex={1}
              />
            </VStack>
          ) : (
            <FormProvider {...formMethods}>
              <CreateOrEditFoodFields flex={1} />
            </FormProvider>
          )}
        </Flex>
      </DrawerBody>

      <DrawerFooter>
        <Button variant="outline" size="lg" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button size="lg" onClick={onSaveButtonClick}>
          Save
        </Button>
      </DrawerFooter>
    </>
  )
}

export default BodyAndFooter