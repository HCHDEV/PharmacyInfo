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
  Box,
  TextField,
} from "@mui/material";
import useEffectOnce from "/hooks/use-effect-once";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { save } from "../../store/counterSlice";
import { X, Pill, Info, Activity, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { MdImageSearch } from "react-icons/md";

// Custom Styled Component
const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#334155", 
    cursor: "default",
    WebkitTextFillColor: "#334155",
  },
});

const PaginatedCollapsibleTable = ({ data }) => {
  const dispatch = useDispatch();

  // States
  const [expandedCategories, setExpandedCategories] = useState({});
  const [openRowId, setOpenRowId] = useState(null);
  const [listPharmacyCat, setListPharmacyCat] = useState([]);
  const [fromError, setFromError] = useState(false);
  const [fromErrorMess, setFromErrorMess] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);
  // Fetch Pharmacy Categories
  useEffectOnce(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_URL_SV +
          process.env.NEXT_PUBLIC_URL_GetListPharmacyCat
      )
      .then((response) => {
        setListPharmacyCat(response.data.PharmacyCat);
      })
      .catch((error) => {
        console.error(error);
        setFromError(true);
        setFromErrorMess(error.message);
      });
  });

  // Fetch Pharmacy Info if not available
  useEffectOnce(() => {
    if (!data?.DataTran?.Data?.DataPharmacy) {
      axios
        .get(
          process.env.NEXT_PUBLIC_URL_SV +
            process.env.NEXT_PUBLIC_URL_GetListPharmacy
        )
        .then((response) => {
          if (response.data.PharmacyInfo && response.data.PharmacyInfo.length > 0) {
            dispatch(
              save({
                value: "มีข้อมูล",
                Data: {
                  DataPharmacy: response.data.PharmacyInfo,
                  SearchAll: "",
                  SubCat: "",
                  Value: "",
                },
              })
            );
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  });

  // Handlers
  const handleToggle = (id) => {
    setOpenRowId((prevId) => (prevId === id ? null : id));
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Data Processing
  const groupedData = (Array.isArray(listPharmacyCat) ? listPharmacyCat : []).reduce(
    (acc, item) => {
      acc[item.CatName] = (data?.DataTran?.Data?.DataPharmacy || []).filter(
        (pharmacy) => pharmacy.RowIDCategory === item.RowIDCategory
      );
      return acc;
    },
    {}
  );

  const pharmacyData = data?.DataTran?.Data?.DataPharmacy;

  // Render Functions for different states
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-20">
      <RefreshCw className="text-blue-500 w-12 h-12 animate-spin mb-4" />
      <div className="text-xl font-medium text-slate-600">กำลังโหลดข้อมูลยา...</div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center p-20 bg-red-50 rounded-xl m-4 border border-red-100">
      <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
      <div className="text-xl font-medium text-red-700 mb-2">เกิดข้อผิดพลาด</div>
      <div className="text-slate-600">{fromErrorMess || "ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้"}</div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col py-6">
      <div className="overflow-auto flex-1 px-4 sm:px-6 lg:px-8">
        <Paper 
          elevation={0} 
          sx={{ 
            width: "100%", 
            maxWidth: "1400px",
            margin: "auto", 
            borderRadius: "16px", 
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          }}
        >
          {fromError ? (
            renderError()
          ) : !pharmacyData ? (
            renderLoading()
          ) : pharmacyData.length > 0 ? (
            <TableContainer className="w-full h-[90vh] overflow-auto custom-scrollbar">
              
              {/* === แก้ไขแถบ Header ตรงนี้: ให้เป็นสีพาสเทลอ่อนๆ === */}
              <div className="px-6 py-5 bg-blue-400 from-blue-50 via-white to-indigo-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shadow-sm border border-blue-200">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide">ตำรับยาภายในโรงพยาบาลหัวเฉียว</h2>
                </div>
                {/* <div className="bg-blue-100/80 border border-blue-200 px-4 py-1.5 rounded-full text-blue-700 text-sm font-semibold shadow-sm">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    ข้อมูลอัปเดตล่าสุด
                  </span>
                </div> */}
              </div>

              <Table stickyHeader aria-label="pharmacy table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#9ecfff', borderBottom: '1px solid #e2e8f0', width: '50px' }}></TableCell>
                    <TableCell sx={{ backgroundColor: '#9ecfff', borderBottom: '1px solid #e2e8f0', color: '#ffffff', fontWeight: 600 }}>
                      SubCategory
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#9ecfff', borderBottom: '1px solid #e2e8f0', color: '#ffffff', fontWeight: 600 }}>
                      Drug Name
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#9ecfff', borderBottom: '1px solid #e2e8f0', color: '#ffffff', fontWeight: 600 }}>
                      Generic Name
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#9ecfff', borderBottom: '1px solid #e2e8f0', color: '#ffffff', fontWeight: 600 }}>
                      Qty
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Object.entries(groupedData).map(([category, items]) => (
                    <React.Fragment key={category}>
                      {/* Category Header Row */}
                      <TableRow hover tabIndex={-1} sx={{ '& td': { padding: 0 } }}>
                        <TableCell colSpan={5}>
                          <button
                            className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                              expandedCategories[category] 
                                ? "bg-slate-100 border-l-4 border-blue-500 text-blue-800" 
                                : "bg-white border-l-4 border-transparent text-slate-700 hover:bg-slate-50"
                            }`}
                            onClick={() => toggleCategory(category)}
                          >
                            <span className={`mr-3 transition-transform duration-200 ${expandedCategories[category] ? "rotate-180 text-blue-600" : "text-slate-400"}`}>
                              <KeyboardArrowDownIcon />
                            </span>
                            <span className="font-semibold text-[15px]">{category}</span>
                            {/* <span className="ml-auto bg-white border border-slate-200 text-slate-500 text-xs px-2.5 py-1 rounded-md font-medium shadow-sm">
                              {items.length} รายการ
                            </span> */}
                          </button>
                        </TableCell>
                      </TableRow>

                      {/* Pharmacy Items Rows */}
                      {expandedCategories[category] &&
                        pharmacyData
                          .filter((item) => item.Category === category)
                          .map((item, index) => (
                            <React.Fragment key={item.id || index}>
                              {/* Main Row */}
                              <TableRow
                                hover
                                tabIndex={-1}
                                onClick={() => handleToggle(item.id)}
                                className="cursor-pointer transition-colors hover:bg-blue-50/30"
                                sx={{ '& > td': { borderBottom: openRowId === item.id ? 'none' : '1px solid rgba(224, 224, 224, 1)' } }}
                              >
                                <TableCell className="pl-6">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${openRowId === item.id ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                                    {openRowId === item.id ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                  </div>
                                </TableCell>
                                <TableCell className="text-slate-600 font-medium">
                                  {item.Subcategory}
                                </TableCell>
                                <TableCell className="text-slate-800 font-semibold">
                                  {item.OverrideDescription}
                                </TableCell>
                                <TableCell className="text-slate-600 italic">
                                  {item.GenericDrug}
                                </TableCell>
                                <TableCell>
                                  {item.Qty === "0" ? (
                                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
                                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse shrink-0"></span>
                                 หมดสต็อก
                               </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                                      {item.Qty || "-"}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>

                              {/* Collapsible Details Row */}
                              <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                  <Collapse in={openRowId === item.id} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: '0 0 16px 0' }}>
                                      
                                      <div className="mx-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        
                                        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
                                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                                            <Info className="w-5 h-5" />
                                          </div>
                                          <h3 className="text-xl font-bold text-slate-800">ข้อมูลรายละเอียดตัวยา (Drug Information)</h3>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-6">
                                          
                                          {/* Image Section */}
                                          <div className="w-full lg:w-1/4 flex flex-col items-center">
  {/* เติม cursor-pointer และ onClick ตรง div นี้ */}
  <div 
    className="w-full aspect-square bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-4 overflow-hidden relative group cursor-pointer"
    onClick={() => item.PictureFile ? setZoomedImage(`/MIMS/PIC/${item.PictureFile}`) : null}
  >
    {item.PictureFile ? (
      <Image
        src={`/MIMS/PIC/${item.PictureFile}`}
        alt={`รูปภาพ ${item.OverrideDescription}`}
        fill
        style={{ objectFit: 'contain', padding: '1rem' }}
        className="transition-transform duration-300 group-hover:scale-110"
      />
    ) : (
      <div className="text-slate-400 flex flex-col items-center">
        <MdImageSearch className="w-16 h-16 mb-2 opacity-50" />
        <span className="text-sm font-medium">No Image</span>
      </div>
    )}
  </div>
  <div className="mt-2 text-xs text-slate-400 font-medium">
    {item.PictureFile ? "คลิกเพื่อขยายรูปภาพ" : ""}
  </div>
</div>

                                          {/* Properties Section */}
                                          <div className="w-full lg:w-3/4">
                                            <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5">
                                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
                                                {[
                                                  { label: "Route", value: item.Route },
                                                  { label: "Form", value: item.Form },
                                                  { label: "Strength", value: item.Strength },
                                                  { label: "Frequency", value: item.Frequency },
                                                  { label: "Instructions", value: item.Instructions },
                                                  { label: "Base UOM", value: item.BaseUOM },
                                                  { label: "Base Qty", value: item.BaseQuantity },
                                                  { label: "Billing Subgroup", value: item.BillingSubgroup },
                                                  { label: "Order SubCat", value: item.OrderSubCategory }
                                                ].map((prop, idx) => (
                                                  <div key={idx} className="flex flex-col">
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{prop.label}</span>
                                                    <span className="text-sm font-medium text-slate-700 mt-0.5">{prop.value || "-"}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Text Areas Section (Cards) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                          {[
                                            { title: "รูปเม็ดยา (Monograph)", content: item.PHCDFMonograph, icon: <Pill className="w-4 h-4" /> },
                                            { title: "Indication", content: item.PHCDFIndication, icon: <Activity className="w-4 h-4" /> },
                                            { title: "Contra Indication", content: item.PHCDFContraInd, icon: <AlertCircle className="w-4 h-4" /> },
                                            { title: "Special Precautions", content: item.PHCDFPrecaution, icon: <AlertTriangle className="w-4 h-4" /> },
                                            { title: "Adverse Reaction", content: item.PHCDFAdvReaction, icon: <Activity className="w-4 h-4" /> },
                                            { title: "Interaction", content: item.PHCDFInteraction, icon: <RefreshCw className="w-4 h-4" /> }
                                          ].map((card, idx) => (
                                            <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col h-48 transition-colors hover:border-blue-200">
                                              <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center text-slate-600">
                                                <span className="mr-2 opacity-70 text-blue-500">{card.icon}</span>
                                                <h4 className="text-sm font-bold text-slate-700">{card.title}</h4>
                                              </div>
                                              <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                  {card.content || <span className="text-slate-400 italic">ไม่มีข้อมูลระบุไว้</span>}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                      </div>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                <Pill className="text-slate-400 w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700">ไม่มีข้อมูลตารางยา</h3>
              <p className="text-slate-500 mt-2">ไม่พบข้อมูลยาในหมวดหมู่ที่ท่านค้นหา</p>
            </div>
          )}
        </Paper>
      </div>

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out transition-opacity"
          onClick={() => setZoomedImage(null)} // คลิกพื้นหลังเพื่อปิด
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            {/* ปุ่มปิด (X) */}
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-red-500 rounded-full p-2 transition-colors z-50 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation(); // ป้องกันไม่ให้ทะลุไปโดนพื้นหลัง
                setZoomedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* รูปภาพขนาดใหญ่ */}
            <img 
              src={zoomedImage} 
              alt="Zoomed Drug" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-pop-in cursor-default"
              onClick={(e) => e.stopPropagation()} // ป้องกันการคลิกที่รูปแล้วปิด
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default PaginatedCollapsibleTable;