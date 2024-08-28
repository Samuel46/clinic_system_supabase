import React from "react";
import { Heading } from "../heading";

type GreetingProps = {
  userName: string;
};

const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  const currentHour = new Date().getHours();

  let greeting = "Hello";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  return (
    <Heading>
      {greeting}, {userName}
    </Heading>
  );
};

export default Greeting;
