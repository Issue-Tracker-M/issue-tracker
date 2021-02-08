import React, { FC } from "react";
import { MotionContainer } from "./MotionContainer";
import { SidebarNav } from "./SidebarNav";

export const AppLayout: FC = ({ children }) => {
  return (
    <MotionContainer display="flex">
      <SidebarNav />
      <MotionContainer as="main" width="100%" height="100vh">
        {children}
      </MotionContainer>
    </MotionContainer>
  );
};
