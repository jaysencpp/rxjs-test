import { faker } from "@faker-js/faker";
import { map } from "rxjs";
import { useObservable } from "./hooks/useObservable";
import { createReactiveBehaviourCallback } from "./utils/createReactiveBehaviorCallback";
//#region Fake
type Fake = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  consistent: string;
};

const createFakeData = (): Fake => {
  return {
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number(5),
    consistent: "Abc",
  };
};
const FAKE_DATA: Fake[] = [];

Array.from({ length: 1000 }).forEach(() => {
  FAKE_DATA.push(createFakeData());
});

type FakeControllerData = {
  fakeData: Fake[];
  groupByKey: keyof Fake;
  valueOfKey: keyof Fake;
};

const fakeData: FakeControllerData = {
  fakeData: FAKE_DATA,
  groupByKey: "age",
  valueOfKey: "firstName",
};
//#endregion

//#region controller
const createFakeController = <T extends FakeControllerData>(fakeCtrl: T) => {
  const { callback, observable } = createReactiveBehaviourCallback(fakeCtrl);

  const FakeController = {
    setFaker: callback,
    fake$: observable,
    groupFake$: observable.pipe(
      map((value) => {
        return value.fakeData.reduce((acc, curr) => {
          const group = acc[curr[value.groupByKey]] || [];
          group.push(curr);
          acc[curr[value.groupByKey]] = group;
          return acc;
        }, {} as Record<PropertyKey, Fake[]>);
      }),
      map((val) => {
        return val;
      })
    ),
  };

  return { ...FakeController };
};

const fakeController = createFakeController(fakeData);

const { fake$, setFaker, groupFake$ } = fakeController;
//#endregion

//#region Components
export const FakeIt = () => {
  return (
    <div>
      <h2>Fakit</h2>
      <SelectGrouping />
      <div
        style={{
          border: "2px solid black",
          height: "300px",
          width: "600px",
          overflow: "auto",
        }}
      >
        <GroupedData />
      </div>
    </div>
  );
};

const GroupedData = () => {
  const groupit = useObservable(groupFake$);
  const fakit = useObservable(fake$);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "2em",
      }}
    >
      {groupit &&
        Object.keys(groupit).map((group) => {
          return (
            <div key={group}>
              <div style={{ fontWeight: "bold" }}>{group}</div>
              {groupit[group].map((data) => {
                return <div key={data.id}> {data[fakit!.valueOfKey]}</div>;
              })}
            </div>
          );
        })}
    </div>
  );
};
const Group = () => {
  const fakit = useObservable(fake$);

  return <h3>Grouping the data on: {fakit?.groupByKey}</h3>;
};
const SelectGrouping = () => {
  const fakeit = useObservable(fake$);

  return (
    <div>
      <Group />
      <select
        onChange={(e) => {
          setFaker({ ...fakeit!, groupByKey: e.target.value as keyof Fake });
        }}
      >
        {fakeit &&
          Object.keys(fakeit.fakeData[0]).map((key, idx) => {
            return (
              <option
                key={idx}
                value={key}
                selected={key === fakeit.groupByKey}
              >
                {key}
              </option>
            );
          })}
      </select>
    </div>
  );
};
//#endregion
