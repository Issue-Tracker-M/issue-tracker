import React from "react";
import { storiesOf } from "@storybook/react";
import VerticalList from "./VerticalList";
import { Text } from "@chakra-ui/react";

storiesOf("VerticalList", module).add("text test", () => (
  <VerticalList>
    {new Array(10).fill("Boppity bop").map((text, i) => (
      <Text key={i}>{text}</Text>
    ))}
  </VerticalList>
));
