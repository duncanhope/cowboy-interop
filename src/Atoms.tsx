import { atom, useRecoilState } from "recoil";
import { isOpenFin, useMultiOpenFinSync } from "./hooks/openfinSync";
import { useOpenFinApplicationUUIDs } from "./hooks/useOpenfinApplicationUuids";
declare const fin: any;

const testOneState = atom({
  key: "testOneState", // unique ID (with respect to other atoms/selectors)
  default: "default", // default value (aka initial value)
});

const testTwoState = atom({
  key: "testTwoState", // unique ID (with respect to other atoms/selectors)
  default: "default", // default value (aka initial value)
});

export function Atoms() {
  useMultiOpenFinSync({ recoilAtoms: [testOneState, testTwoState] });

  const ownUuid = isOpenFin ? window.fin.me.uuid : "";
  const applicationUuids = useOpenFinApplicationUUIDs();

  const [testOne, setTestOne] = useRecoilState(testOneState);
  const [testTwo, setTestTwo] = useRecoilState(testTwoState);

  return (
    <div className="App">
      <h1>OpenFin UUIDs</h1>
      <ul>
        {applicationUuids.map((uuid) => (
          <li key={uuid}>
            {uuid}
            {
              <a
                onClick={async () => {
                  await fin.Application.wrap({ uuid }).then((app: any) =>
                    app.close()
                  );
                }}
              >
                &nbsp;[x]
              </a>
            }
            {uuid === ownUuid && " (this) "}
          </li>
        ))}
      </ul>

      <h1>Atom: {testOne}</h1>
      <h1>Atom: {testTwo}</h1>
      <div
        onClick={() => {
          setTestOne("one");
        }}
      >
        one
      </div>
      <div
        onClick={() => {
          setTestOne("two");
        }}
      >
        two
      </div>
      <div
        onClick={() => {
          setTestOne("three");
        }}
      >
        three
      </div>
      <div
        onClick={() => {
          setTestTwo("hello");
        }}
      >
        hello
      </div>
      <div
        onClick={() => {
          setTestTwo("world");
        }}
      >
        world
      </div>
    </div>
  );
}
