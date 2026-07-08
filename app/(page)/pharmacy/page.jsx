"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pharmacy from "../../components/pharmacy/pharmacy";
import { save } from "../../store/counterSlice";

export default function Home() {
  const dispatch = useDispatch(); // เรียกใช้ useDispatch นอกเงื่อนไข
  const DataTran = useSelector((state) => ({ ...state }));
  const isDataValid = DataTran?.Data?.value && DataTran.Data.value !== "ไม่มีข้อมูล";

  useEffect(() => {
    if (isDataValid) {
      const initialState = {
        value: "ไม่มีข้อมูล",
        Data: {},
      };
      dispatch(save(initialState));
    }
  }, [dispatch, isDataValid]);

  return (
    <>
      <Pharmacy data={DataTran} />
    </>
  );
}
