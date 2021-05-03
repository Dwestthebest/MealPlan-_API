import { Text, Box, Flex, BoxProps } from '@chakra-ui/react'
import { useFoodCategoryByIdMap } from 'core/foodsCategories/FoodsCategoriesProvider'
import { useFoodsByIdState } from 'core/foods/FoodsByIdProvider'
import { IngredientField } from 'core/dietForm'
import { getFoodCategoryIcon } from 'core/foodsCategories'

type Props = {
  ingredientField: IngredientField
} & BoxProps

function FoodInfo({ ingredientField, ...rest }: Props) {
  if (!ingredientField.foodId) {
    throw new Error('Food id is missing')
  }

  const foodsByIdState = useFoodsByIdState()
  const foodCategoryByIdMap = useFoodCategoryByIdMap()
  const food = foodsByIdState[ingredientField.foodId]
  const foodCategory = foodCategoryByIdMap[food.categoryId]
  const FoodCategoryIcon = getFoodCategoryIcon(foodCategory)

  return (
    <Flex height="100%" alignItems="center">
      <Box
        height="100%"
        position="absolute"
        top="0"
        left="0"
        width="6px"
        backgroundColor={foodCategory.color}
      />

      <FoodCategoryIcon ml={1} mr={2} fill="gray.600" />

      <Text fontSize="lg" color="gray.600">
        {food.name}
      </Text>
    </Flex>
  )
}

export default FoodInfo