import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import "@radix-ui/themes/styles.css";
import { Button, Flex, Theme, Text } from "@radix-ui/themes";

function App() {
  return (
    <>
      <Theme accentColor="grass" grayColor="gray" radius="full">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Theme>
    </>
  );
}

export default App;

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Flex direction="column" gap="2" width={"100%"} align="center">
        <Text>Hello from Radix Themes :)</Text>
        <Button>Let's go</Button>
      </Flex>
    </div>
  );
}
