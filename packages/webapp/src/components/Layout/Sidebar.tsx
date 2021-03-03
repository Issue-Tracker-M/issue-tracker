import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  PropsOf,
  useColorMode,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { FC, ReactNode } from "react";
import { useIsMounted } from "../../hooks/useIsMounted";
import { MotionContainer } from "./MotionContainer";

interface IProps extends UseDisclosureProps, PropsOf<typeof MotionContainer> {
  toggleControl?: ReactNode;
}

export const Sidebar: FC<IProps> = ({
  children,
  onClose,
  onOpen,
  defaultIsOpen,
  toggleControl,
  isOpen: open,
  ...rest
}) => {
  const { colorMode } = useColorMode();
  const isMounted = useIsMounted();
  const { isOpen, onToggle } = useDisclosure({
    onOpen,
    onClose,
    isOpen: open,
    defaultIsOpen,
  }); /* Control panel opening */

  const animate = {
    animate: { opacity: 1, width: "max-content", scaleX: 1 },
    initial: isMounted.current
      ? { opacity: 0, width: "0px", scaleX: 0 }
      : { opacity: 1, width: "max-content", scaleX: 1 },
  };
  return (
    <AnimateSharedLayout>
      <MotionContainer layout position="relative" {...rest} flex="0 0 auto">
        <MotionContainer layout top="2" position="absolute" right="-3rem">
          {toggleControl ? (
            toggleControl
          ) : (
            <IconButton
              onClick={onToggle}
              aria-label="Open nav"
              colorScheme="teal"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              isRound
            />
          )}
        </MotionContainer>
        <AnimatePresence>
          {isOpen && (
            <MotionContainer
              layout
              h="100%"
              {...animate}
              exit={{ opacity: 0, width: "0px", scaleX: 0 }}>
              {children}
            </MotionContainer>
          )}
        </AnimatePresence>
      </MotionContainer>
    </AnimateSharedLayout>
  );
};
