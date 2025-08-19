import { type LoaderFunction, redirect } from "react-router";
import PanelLayout from "./PanelLayout";

export const loader: LoaderFunction = async ({ context }) => {
  const { employee } = context;
  if (!employee) {
    throw redirect("/panel/login");
  }
  
  // 返回員工資料，確保 loader 有返回值
  return { employee };
}

export default PanelLayout;
