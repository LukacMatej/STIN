
export interface PersonInfoCategoryModel {
  name: string
}

export function PersonInfoCategoryModel(name: string): PersonInfoCategoryModel {
  return {
    name: name
  }
}
