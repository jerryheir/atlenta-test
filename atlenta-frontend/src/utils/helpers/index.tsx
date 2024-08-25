import { Priority } from "src/types";

export const getPriorityColorScheme = (priority: Priority) => {
  switch (priority) {
    case Priority.Low:
      return "gray";
    case Priority.Medium:
      return "orange";
    case Priority.High:
      return "red";
    default:
      return "gray";
  }
};

export const capitalizeEachFirstLetter = (text: string = "") => {
  return text?.replace(/\b\w/g, (match) => {
    return match.toUpperCase();
  });
};
