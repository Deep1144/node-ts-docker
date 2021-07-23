/**
 *
 * @param from
 * @param localField
 * @param foreignField
 * @param as
 * @returns lookup object
 */
export const generateLookUp = (
  from: string,
  localField: string,
  foreignField: string,
  as: string
): Record<string, any> => {
  return {
    $lookup: {
      from,
      localField,
      foreignField,
      as,
    },
  };
};
