// let originalData = [];
// let currentSort = { column: null, direction: "asc" };
// let currentPage = 1;
// const pageSize = 10;

// d3.csv("chocolate_sales.csv").then(data => {
//   data.forEach(d => {
//     d.Amount = +d.Amount.replace(/[$,\\s]/g, '');
//     d["Boxes Shipped"] = +d["Boxes Shipped"];
//     d.Date = new Date(d.Date);
//   });
//   originalData = data;
//   updateTable();
// });

// function updateTable() {
//   let data = [...originalData];

//   // Filters
//   const country = d3.select("#filter-country").property("value").toLowerCase();
//   const minAmount = +d3.select("#filter-amount").property("value");
//   const minBoxes = +d3.select("#filter-boxes").property("value");

//   if (country) data = data.filter(d => d.Country.toLowerCase().includes(country));
//   if (minAmount) data = data.filter(d => d.Amount >= minAmount);
//   if (minBoxes) data = data.filter(d => d["Boxes Shipped"] >= minBoxes);

//   // Sort
//   if (currentSort.column) {
//     data.sort((a, b) => {
//       const valA = a[currentSort.column];
//       const valB = b[currentSort.column];
//       return currentSort.direction === "asc"
//         ? d3.ascending(valA, valB)
//         : d3.descending(valA, valB);
//     });
//   }

//   const totalPages = Math.ceil(data.length / pageSize);
//   currentPage = Math.min(currentPage, totalPages);
//   const start = (currentPage - 1) * pageSize;
//   const pageData = data.slice(start, start + pageSize);

//   drawTable(pageData);
//   d3.select("#page-info").text(`Page ${currentPage} of ${totalPages}`);
//   d3.select("#prev-page").attr("abled", currentPage === 1);
//   d3.select("#next-page").attr("abled", currentPage === totalPages);
// }

// function drawTable(data) {
//   const container = d3.select("#table-container");
//   container.html("");

//   const table = container.append("table");
//   const thead = table.append("thead");
//   const tbody = table.append("tbody");

//   const columns = [
//     { label: "Sales Person", key: "Sales Person" },
//     { label: "Country", key: "Country" },
//     { label: "Product", key: "Product" },
//     { label: "Date", key: "Date" },
//     { label: "Amount", key: "Amount" },
//     { label: "Boxes Shipped", key: "Boxes Shipped" }
//   ];

//   const headerRow = thead.append("tr");
//   headerRow.selectAll("th")
//     .data(columns)
//     .enter()
//     .append("th")
//     .text(d => d.label)
//     .attr("class", d => {
//       if (currentSort.column === d.key) {
//         return currentSort.direction === "asc" ? "sort-asc" : "sort-desc";
//       }
//       return "";
//     })
//     .on("click", (event, d) => {
//       if (currentSort.column === d.key) {
//         currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
//       } else {
//         currentSort.column = d.key;
//         currentSort.direction = "asc";
//       }
//       updateTable();
//     });

//   const rows = tbody.selectAll("tr").data(data).enter().append("tr");
//   rows.append("td").text(d => d["Sales Person"]);
//   rows.append("td").text(d => d.Country);
//   rows.append("td").text(d => d.Product);
//   rows.append("td").text(d => d.Date.toLocaleDateString());
//   rows.append("td").text(d => `$${d.Amount.toLocaleString()}`);
//   rows.append("td").text(d => d["Boxes Shipped"]);
// }

// // Controls
// d3.select("#apply-filters").on("click", () => {
//   currentPage = 1;
//   updateTable();
// });

// d3.select("#reset").on("click", () => {
//   d3.selectAll("input").property("value", "");
//   currentPage = 1;
//   currentSort = { column: null, direction: "asc" };
//   updateTable();
// });

// d3.select("#prev-page").on("click", () => {
//   if (currentPage > 1) {
//     currentPage--;
//     updateTable();
//   }
// });

// d3.select("#next-page").on("click", () => {
//   currentPage++;
//   updateTable();
// });
let originalData = [];
let currentSort = { column: null, direction: "asc" };
let currentPage = 1;
const pageSize = 10;
const filters = {};

d3.csv("chocolate_sales.csv").then(data => {
  data.forEach(d => {
    d.Amount = +d.Amount.replace(/[$,\\s]/g, '');
    d["Boxes Shipped"] = +d["Boxes Shipped"];
    d.Date = new Date(d.Date);
  });
  originalData = data;
  updateTable();
});

function updateTable() {
  let data = [...originalData];

  Object.keys(filters).forEach(key => {
    const val = filters[key];
    if (val !== "") {
      if (typeof originalData[0][key] === "number") {
        data = data.filter(d => d[key] >= +val);
      } else {
        data = data.filter(d => d[key].toString().toLowerCase().includes(val.toLowerCase()));
      }
    }
  });

  if (currentSort.column) {
    data.sort((a, b) => {
      const valA = a[currentSort.column];
      const valB = b[currentSort.column];
      return currentSort.direction === "asc"
        ? d3.ascending(valA, valB)
        : d3.descending(valA, valB);
    });
  }

  const totalPages = Math.ceil(data.length / pageSize);
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  drawTable(pageData);
  d3.select("#page-info").text(`Page ${currentPage} of ${totalPages}`);
  d3.select("#prev-page").attr("abled", currentPage === 1);
  d3.select("#next-page").attr("abled", currentPage === totalPages);
}

function drawTable(data) {
  const container = d3.select("#table-container");
  container.html("");

  const table = container.append("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  const columns = [
    { label: "Sales Person", key: "Sales Person" },
    { label: "Country", key: "Country" },
    { label: "Product", key: "Product" },
    { label: "Date", key: "Date" },
    { label: "Amount", key: "Amount" },
    { label: "Boxes Shipped", key: "Boxes Shipped" }
  ];

  // 정렬용 헤더
  const headerRow = thead.append("tr");
  headerRow.selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(d => d.label)
    .attr("class", d => {
      if (currentSort.column === d.key) {
        return currentSort.direction === "asc" ? "sort-asc" : "sort-desc";
      }
      return "";
    })
    .on("click", (event, d) => {
      if (currentSort.column === d.key) {
        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        currentSort.column = d.key;
        currentSort.direction = "asc";
      }
      updateTable();
    });

  // 필터용 입력창
  const filterRow = thead.append("tr").attr("class", "filter-row");
  filterRow.selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .html(d => {
      // 카테고리 열에는 select 사용
      if (["Country", "Product", "Sales Person"].includes(d.label)) {
        const values = Array.from(new Set(originalData.map(r => r[d.key]))).sort();
        let options = `<option value="">All</option>`;
        values.forEach(v => options += `<option value="${v}">${v}</option>`);
        return `<select data-key="${d.key}">${options}</select>`;
      } else {
        // 숫자 및 기타 열에는 input 사용
        return `<input data-key="${d.key}" type="text" placeholder="Filter..." />`;
      }
    });

  // 필터 이벤트 연결
  d3.selectAll("input[data-key], select[data-key]").on("input", function () {
    const key = this.getAttribute("data-key");
    const val = this.value;
    if (val === "") {
      delete filters[key];
    } else {
      filters[key] = val;
    }
    currentPage = 1;
    updateTable();
  });

  // 본문 행
  const rows = tbody.selectAll("tr").data(data).enter().append("tr");
  rows.append("td").text(d => d["Sales Person"]);
  rows.append("td").text(d => d.Country);
  rows.append("td").text(d => d.Product);
  rows.append("td").text(d => d.Date.toLocaleDateString());
  rows.append("td").text(d => `$${d.Amount.toLocaleString()}`);
  rows.append("td").text(d => d["Boxes Shipped"]);
}

// 페이지 이벤트
d3.select("#prev-page").on("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
});

d3.select("#next-page").on("click", () => {
  currentPage++;
  updateTable();
});
