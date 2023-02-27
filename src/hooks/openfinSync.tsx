import { useEffect } from "react";
import { useRecoilState, RecoilState } from "recoil";
declare global {
  interface Window {
    fin: any;
  }
}

export const isOpenFin = typeof window !== "undefined" && window.fin;

export function useOpenFinSync({
  recoilAtom,
  uuid = "*",
  topic = "topic",
}: {
  recoilAtom: RecoilState<string>;
  uuid?: string;
  topic?: string;
}) {
  if (!isOpenFin) {
    return;
  }

  const [atomState, setAtomState] = useRecoilState(recoilAtom);
  const interAppBus = window.fin.InterApplicationBus;

  useEffect(() => {
    const initInterAppBus = async () => {
      interAppBus.subscribe(
        { uuid: uuid },
        `${topic}-recoil-${recoilAtom.key}`,
        (payload: any) => {
          setAtomState(payload);
        }
      );
    };

    initInterAppBus();

    return () => {
      if (interAppBus) {
        interAppBus.unsubscribe(
          { uuid: uuid },
          `${topic}-recoil-${recoilAtom.key}`,
          () => {}
        );
      }
    };
  }, []);

  useEffect(() => {
    if (interAppBus) {
      interAppBus.publish(`${topic}-recoil-${recoilAtom.key}`, atomState);
    }
  }, [atomState]);
}

export function useMultiOpenFinSync({
  recoilAtoms,
  uuid = "*",
  topic = "topic",
}: {
  recoilAtoms: RecoilState<string>[];
  uuid?: string;
  topic?: string;
}) {
  if (!isOpenFin) {
    return;
  }

  const hooks = recoilAtoms.map((recoilAtom) =>
    useOpenFinSync({ recoilAtom, uuid, topic })
  );
  return hooks;
}
