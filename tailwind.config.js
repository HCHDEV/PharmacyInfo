module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#34BFEA", // 
          secondary: "#e1f5fe", // พื้นหลัง
          info: "#ffa726", // หัวข้อ
          neutral: "#0288d1", // Cat
          accent: "#00bcd4", // กดปุ่มเปิด Cat
          "base-100": "#FFFFFF", // 
          success: "#72d572", // เขียวพาสเทล      
          warning: "#FCDE70", // เหลืองพาสเทล
          error: "#fe5858", // แดงพาสเทล
        },
      },
    ],
  },
};
