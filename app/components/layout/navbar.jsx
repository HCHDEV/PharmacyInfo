import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Typography,
  Box,
  Button,
  TablePagination,
  TextField,
  Autocomplete,
} from "@mui/material";
import useEffectOnce from "/hooks/use-effect-once";
import InputLabel from '@mui/material/InputLabel';
import { MdCancel } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from "react-redux";  //นำเข้า useDispatch อย่างถูกต้อง
import { save } from "../../store/counterSlice";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Image from "next/image";
import { MdImageSearch } from "react-icons/md";
export default function Navbar() {
  const [openRowId, setOpenRowId] = useState(null); // เก็บแค่ id ของแถวที่เปิดอยู่
  const [dataSearch, setDataSearch] = useState("");  //ใช้ useState จัดการ state
  const [pharmacyCat, setPharmacyCat] = React.useState('');
  const [pharmacySubCat, setPharmacySubCat] = React.useState('');
  const [listPharmacyCat, setListPharmacyCat] = React.useState('');
  const [listPharmacySucCat, setListPharmacySucCat] = React.useState('');
  const [rows, setRows] = React.useState('');
  const dispatch = useDispatch();  

  const handleToggle = (id) => {
    // สลับสถานะระหว่างเปิดและปิด
    setOpenRowId((prevId) => (prevId === id ? null : id));
  };
  const modalSearch = () => {

    setDataSearch("");
    setRows("")
    document.getElementById("my_modal_5").showModal()
  };


  const Search = (e) => {
    // document.getElementById("my_modal_5").close()
    const inputValue = e.target.value; 

    setDataSearch(inputValue);



  };

  async function SuccSearch(event) {
    event.preventDefault();
    // console.log("Succ Search")


    if(dataSearch){
    const Value =dataSearch
    const url = `${process.env.NEXT_PUBLIC_URL_SV}${process.env.NEXT_PUBLIC_URL_GetPharmacyHCH}/${Value}`;
    console.log(url)
  axios
    .get(url)
    .then((response) => {
     // console.log(response.data.PharmacyInfo)
       if(response.data.PharmacyInfo[0].DrugCode){

        setRows(response.data.PharmacyInfo)


       }else{
        setRows("")
       }
    })
    .catch((error) => {

          console.log(error);
    });
  }else{
    setRows("")
  }


  }


  return (
    <>
     <button className="btn absolute right-2 top-6 mt-2 -translate-y-1/2 bg-primary text-base-100 hover:bg-error" onClick={modalSearch} >
     <FaSearch />
     </button>





     <dialog id="my_modal_5" className="modal">
        <div className="modal-box h-full max-w-full  text-center">
          <form onSubmit={SuccSearch}>
          Search
          <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() =>document.getElementById("my_modal_5").close()} >✕</div>
          <hr />
  <div className="join">
    <input type="text" className="input input-success join-item mt-2 " placeholder="Search"                  
    value={dataSearch}
                 onChange={Search}
                 />
    <button className="btn join-item mt-2 bg-success text-base-100 hover:bg-base-100 hover:text-success" type="submit">Submit</button>
  </div>
          



          <TableContainer className="w-full h-full overflow-auto mt-2">
  <Table stickyHeader aria-label="sticky table">
    <TableHead className="sticky top-0 z-50 bg-info shadow-md">
    <TableRow className="text-base-100 whitespace-nowrap">
  <TableCell className="bg-info"></TableCell>
  <TableCell className="bg-info break-normal whitespace-nowrap">
    <div className="rounded-full px-3 py-2 bg-base-100 text-center text-lg ">Category</div>
  </TableCell>
  <TableCell className="bg-info break-normal whitespace-nowrap">
    <div className="rounded-full px-3 py-2 bg-base-100 text-center text-lg ">SubCategory</div>
  </TableCell>
  <TableCell className="bg-info break-normal whitespace-nowrap">
    <div className="rounded-full px-3 py-2 bg-base-100 text-center text-lg">Drug Name</div>
  </TableCell>
  <TableCell className="bg-info break-normal whitespace-nowrap">
    <div className="rounded-full px-3 py-2 bg-base-100 text-center text-lg">Generic Name</div>
  </TableCell>
  <TableCell className="bg-info break-normal whitespace-nowrap">
    <div className="rounded-full px-3 py-2 bg-base-100 text-center text-base">Qty</div>
  </TableCell>
</TableRow> 
      </TableHead>
      <TableBody>
       

    {rows ? rows.map((item, index) => (
      <React.Fragment key={index}>
        <TableRow hover role="checkbox" tabIndex={-1} className="">
        <TableCell className="">
              <button className="text-primary text-xs" onClick={() => handleToggle(item.id)}>
                {openRowId === item.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </button>
        </TableCell>
        <TableCell className="break-all text-xs">{item.Category}</TableCell>
        <TableCell className="break-all text-base">{item.Subcategory}</TableCell>
          <TableCell className="break-all text-base">{item.OverrideDescription}</TableCell>
          <TableCell className="break-all text-base">{item.GenericDrug}</TableCell>
         <TableCell className="break-all text-xs">  {item.Qty === "0" ? <><div className="rounded-full px-3 py-2 bg-error text-base-100 text-base text-center break-normal whitespace-nowrap">หมดสต็อกชั่วคราว</div></> : item.Qty === "" ? "ไม่มี" : item.Qty} </TableCell>
        </TableRow>




        <TableRow className="">
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                  <Collapse in={openRowId === item.id} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                    <div className="container mx-auto justify-center border-solid w-5/5 m-auto border-2 border-warning rounded-lg p-4 mt-2">
                    <h1 className="font-black text-accent text-3xl ">Drug form</h1>
                    <div className="flex bg-white shadow-md rounded-lg p-4">
                  <div className="w-1/3">
                  {item.PictureFile ? (
                   <div className="rounded-md p-4 flex justify-center items-center flex-col">
                  <Image
            src={`/MIMS/PIC/${item.PictureFile}`}
            alt={`ไม่มีรูปภาพ ${item.PictureFile}`}
        width={300}
        height={300}
        className="rounded-lg shadow-md "
                  /> 
                </div>
                ) : (
                    <>
<div className="rounded-md p-4 flex justify-center items-center flex-col">
  <p className="font-semibold text-center text-4xl">
    <MdImageSearch />
  </p>
  <p className="font-semibold text-center">No image available</p>
</div>
                    </>
                  )}
                  </div>
                  <div className="w-2/3 px-4 flex flex-col justify-center">
            <div className="grid gap-2 sm:grid-cols-2 w-full mt-2">
                  <p className="text-gray-600">📌 Route : {item.Route}</p>
                  <p className="text-gray-600">📌 Form :  {item.Form}</p>
                  <p className="text-gray-600">📌 Strength :  {item.Strength}</p>
                  <p className="text-gray-600">📌 Frequency : {item.Frequency}</p>
                  <p className="text-gray-600">📌 Instructions : {item.Instructions}</p>
                  <p className="text-gray-600">📌 Base UOM : {item.BaseUOM}</p>
                  <p className="text-gray-600">📌 Base Quantity : {item.BaseQuantity}</p>
            </div>
                  <hr/>
  {/* ข้อความด้านขวา */}
  <div className="w-full sm:grid-cols-2 grid gap-2 p-4">
    <div className="rounded-md p-4 bg-gray-100">
      <p className="text-gray-700 font-semibold">รูปเม็ดยา:</p>
      <textarea className="border-none w-full bg-white p-2 rounded-md shadow-inner" rows={5} disabled>{item.PHCDFMonograph}</textarea>
    </div>
    <div className="rounded-md p-4 bg-gray-100">
      <p className="text-gray-700 font-semibold">Indication:</p>
      <textarea className="border-none w-full bg-white p-2 rounded-md shadow-inner" rows={5} disabled>{item.PHCDFIndication}</textarea>
    </div>
    <div className="rounded-md p-4 bg-gray-100">
      <p className="text-gray-700 font-semibold">Contra Indication:</p>
      <textarea className="border-none w-full bg-white p-2 rounded-md shadow-inner" rows={5} disabled>{item.PHCDFContraInd}</textarea>
    </div>
    <div className="rounded-md p-4 bg-gray-100">
      <p className="text-gray-700 font-semibold">Special Precautions:</p>
      <textarea className="border-none w-full bg-white p-2 rounded-md shadow-inner" rows={5} disabled>{item.PHCDFPrecaution}</textarea>
    </div>
    <div className="rounded-md p-4 bg-gray-100">
      <p className="text-gray-700 font-semibold">Adverse Reaction:</p>
      <textarea className="border-none w-full bg-white p-2 rounded-md shadow-inner" rows={5} disabled>{item.PHCDFAdvReaction}</textarea>
    </div>
    <div className="rounded-md p-4 bg-gray-100">
      <p className="text-gray-700 font-semibold">Interaction:</p>
      <textarea className="border-none w-full bg-white p-2 rounded-md shadow-inner" rows={5} disabled>{item.PHCDFInteraction}</textarea>
    </div>
  </div>




                  </div>



                  
                      </div>
                    </div>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
      </React.Fragment>
      )): (
        <>
       <TableRow hover role="checkbox" tabIndex={-1} className="">
        <TableCell className=""></TableCell>
        <TableCell className=""></TableCell>
        <TableCell className=""></TableCell>
        <TableCell className="flex items-center">No data available in table</TableCell>
        <TableCell className=""></TableCell>
        <TableCell className=""></TableCell>
        {/* <TableCell className=""></TableCell> */}
        </TableRow>
        </>
      )}
      


      </TableBody>
    </Table>
</TableContainer>
</form>


        </div>
        <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
      </dialog>
</>
  );
}
