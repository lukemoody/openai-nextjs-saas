import { atom } from "recoil";

export const profileAtom = atom({
  key: "profileAtom",
  default: {
    credits: 0,
    uid: "",
  } as Profile,
});

// default could be string, number, object {} etc. The define the values inside
// To make TypeSafe us 'as' to set the type.
