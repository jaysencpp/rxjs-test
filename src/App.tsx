import { useState } from "react";
import "./App.css";
import { useObservable } from "./hooks/useObservable";
import { faker } from "@faker-js/faker";
import { createReactiveBehaviourCallback } from "./utils/createReactiveBehaviorCallback";
import { useSubscription } from "./hooks/useSubscription";
import { FakeIt } from "./Test";
type GardenT = {
  data: Record<string, unknown>[];
  gardenKey: string;
};
const createGardenController = <T extends GardenT>(garden: T) => {
  // const { callback, observable } = createReactiveCallback<T>();
  const { callback, observable } = createReactiveBehaviourCallback<T>(garden);

  const GardenController = {
    setGarden: callback,
    garden$: observable,
  };
  return { ...GardenController };
};

const gardenController = createGardenController<GardenT>({
  gardenKey: faker.name.firstName(),
  data: [{ id: "2" }],
});
const { setGarden, garden$ } = gardenController;

const Garden = () => {
  const garden = useObservable(garden$);

  return (
    <div>
      <h2>Garden</h2>
      <button
        onClick={() =>
          garden && setGarden({ ...garden, gardenKey: faker.name.firstName() })
        }
      >
        Change garden group
      </button>
      <div>Current garden key is {garden?.gardenKey}</div>
    </div>
  );
};

const TableBody = () => {
  const [garden, setGarden] = useState<GardenT | null>(null);
  useSubscription(garden$, (val) => {
    console.log("Hoi");
    setGarden(val);
  });

  return (
    <div>
      Listening to Garden??
      {garden && garden.gardenKey}
    </div>
  );
};
const Table = () => {
  return (
    <div>
      <h2>Table</h2>
      <TableBody />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Garden />
      <Table />
      <FakeIt />
    </div>
  );
}

export default App;

