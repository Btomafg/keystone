export enum ProjectType {
  Residential = 0,
  Commercial = 1,
  Custom = 2,
}

export const ProjectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.Residential]: 'Residential',
  [ProjectType.Commercial]: 'Commercial',
  [ProjectType.Custom]: 'Custom',
};

export enum ProjectStatus {
  New = 0,
  Review = 1,
  Design = 2,
  Proposal = 3,
  Production = 4,
  Paint = 5,
  Delivery = 6,
  Install = 7,
}

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.New]: 'New',
  [ProjectStatus.Review]: 'Review',
  [ProjectStatus.Design]: 'Design',
  [ProjectStatus.Proposal]: 'Proposal',
  [ProjectStatus.Production]: 'Production',
  [ProjectStatus.Paint]: 'Paint',
  [ProjectStatus.Delivery]: 'Delivery',
  [ProjectStatus.Install]: 'Install',
};

export enum RoomType {
  Kitchen = 0,
  Bathroom = 1,
  Mudroom = 2,
  Laundry = 3,
  Office = 4,
  Garage = 5,
  Closet = 6,
  Pantry = 7,
  Other = 8,
}

export const RoomTypeLabels: Record<RoomType, string> = {
  [RoomType.Kitchen]: 'Kitchen',
  [RoomType.Bathroom]: 'Bathroom',
  [RoomType.Mudroom]: 'Mudroom',
  [RoomType.Laundry]: 'Laundry',
  [RoomType.Office]: 'Office',
  [RoomType.Garage]: 'Garage',
  [RoomType.Closet]: 'Closet',
  [RoomType.Pantry]: 'Pantry',
  [RoomType.Other]: 'Other',
};

export enum CabinetOptionType {
  Ceiling = 1,
  DoorMaterial = 2,
  SubMaterial = 3,
  ConstructionMethod = 4,
  ToeStyle = 5,
  Crown = 6,
  LightRail = 7,
}
export const CabinetOptionTypeLabels: Record<CabinetOptionType, string> = {
  [CabinetOptionType.Ceiling]: 'Ceiling Options',
  [CabinetOptionType.DoorMaterial]: 'Door Material',
  [CabinetOptionType.SubMaterial]: 'Sub Material',
  [CabinetOptionType.ConstructionMethod]: 'Construction Method',
  [CabinetOptionType.ToeStyle]: 'Toe Style',
  [CabinetOptionType.Crown]: 'Crown',
  [CabinetOptionType.LightRail]: 'Light Rail',
};
