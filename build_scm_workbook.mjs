import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:\\Users\\fujifilm\\Desktop\\AI-SCM Project\\outputs\\20260813_scm";
await fs.mkdir(outputDir, { recursive: true });

const wb = Workbook.create();
const names = ["Guide", "Input_OL", "Input_SFDC", "Input_Inventory", "Master_BOM", "Master_Rules", "Master_Supplier", "Master_Policy", "Master_Approval", "FXLIVE_Map", "Input_Implementation", "Calc_Device", "Calc_Option", "Report_Approval", "Inbound_PO", "Dashboard"];
const sh = Object.fromEntries(names.map(n => [n, wb.worksheets.add(n)]));
for (const s of Object.values(sh)) s.showGridLines = false;

const colors = {
  navy: "#17365D", blue: "#D9EAF7", lightBlue: "#EAF3F8", teal: "#DDEBF7",
  green: "#E2F0D9", yellow: "#FFF2CC", orange: "#FCE4D6", red: "#F4CCCC",
  gray: "#F2F2F2", darkGray: "#666666", white: "#FFFFFF", border: "#D9E1F2"
};

function title(sheet, text, endCol) {
  sheet.mergeCells(`A1:${endCol}1`);
  sheet.getRange("A1").values = [[text]];
  sheet.getRange(`A1:${endCol}1`).format = { fill: colors.navy, font: { bold: true, color: colors.white, size: 16 }, horizontalAlignment: "center", verticalAlignment: "center" };
  sheet.getRange(`A1:${endCol}1`).format.rowHeight = 30;
}
function section(sheet, range, text) {
  sheet.mergeCells(range);
  const cell = range.split(":")[0];
  sheet.getRange(cell).values = [[text]];
  sheet.getRange(range).format = { fill: colors.blue, font: { bold: true, color: colors.navy }, verticalAlignment: "center" };
}
function header(sheet, range) {
  sheet.getRange(range).format = { fill: colors.navy, font: { bold: true, color: colors.white }, wrapText: true, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: colors.border } };
}
function body(sheet, range) {
  sheet.getRange(range).format = { borders: { preset: "all", style: "thin", color: colors.border }, verticalAlignment: "center" };
}
function inputStyle(sheet, range) {
  sheet.getRange(range).format = { fill: "#FFFDF2", borders: { preset: "all", style: "thin", color: colors.border } };
}
function formulaStyle(sheet, range) {
  sheet.getRange(range).format = { fill: colors.lightBlue, borders: { preset: "all", style: "thin", color: colors.border } };
}

// Guide
title(sh.Guide, "기기·옵션 발주 및 입고관리 운영 엑셀 양식", "H");
sh.Guide.getRange("A3:H3").values = [["목적", "OL·SFDC·Trend·수급회의를 기반으로 발주량을 산출하고, 승인·FX-LIVE·입고·PO Match까지 이력을 관리합니다.", null, null, null, null, null, null]];
sh.Guide.mergeCells("B3:H3");
sh.Guide.getRange("A3").format = { fill: colors.blue, font: { bold: true } };
sh.Guide.getRange("B3:H3").format = { wrapText: true, fill: colors.gray };
section(sh.Guide, "A5:H5", "시트 사용순서");
sh.Guide.getRange("A6:C16").values = [
  ["순서", "시트", "사용방법"],
  ["1", "Master_Rules", "Supplier, Lead Time, MOQ, Flexibility Rule, 단가, 평균 사용량 기준을 먼저 입력"],
  ["2", "Input_OL", "영업부서별 OL을 기종·필요월도 기준으로 입력"],
  ["3", "Input_SFDC", "중요 파이프라인 및 OL 외 Bulk Deal 입력"],
  ["4", "Input_Inventory", "전월 말 재고와 Open PO 입력"],
  ["5", "Master_BOM", "기종-옵션 관계, BOM, 장착율, 필수품/Common품 여부 입력"],
  ["6", "Calc_Device", "확정수요·재고·Open PO·MOQ·Flex 기준 기기 발주량 확인"],
  ["7", "Calc_Option", "기기 수요·장착율·BOM·평균사용량·재고 기준 옵션 발주량 확인"],
  ["8", "Report_Approval", "사장 보고용 금액/비교/차이사유 작성 및 승인상태 관리"],
  ["9", "Inbound_PO", "FX-LIVE 이후 선적·통관·입고·검수·Invoice·PO Match 관리"],
  ["10", "Dashboard", "주요 KPI와 리스크 요약 확인"]
];
header(sh.Guide, "A6:C6"); body(sh.Guide, "A7:C16");
section(sh.Guide, "A18:H18", "핵심 산식");
sh.Guide.getRange("A19:H23").values = [
  ["기기 발주 필요량", "확정 수요 - 전월 말 가용재고 - 필요월도 전 입고예정 Open PO", null, null, null, null, null, null],
  ["옵션 소요량", "기기 수요 × 장착율 × BOM 수량 + 평균 사용량 기반 수요", null, null, null, null, null, null],
  ["최종 발주량", "필요량을 MOQ/발주단위 기준으로 올림 조정", null, null, null, null, null, null],
  ["Flexibility Rule", "전월 OL 대비 ±20%, 전전월 OL 대비 ±30%", null, null, null, null, null, null],
  ["주의", "예시 행은 사용법 확인용입니다. 실제 업무 적용 전 기준정보와 입력 데이터를 교체하십시오.", null, null, null, null, null, null]
];
for (let r = 19; r <= 23; r++) sh.Guide.mergeCells(`B${r}:H${r}`);
sh.Guide.getRange("A19:A23").format = { fill: colors.blue, font: { bold: true } };
sh.Guide.getRange("B19:H23").format = { wrapText: true };
sh.Guide.getRange("A:A").format.columnWidth = 20; sh.Guide.getRange("B:B").format.columnWidth = 22; sh.Guide.getRange("C:H").format.columnWidth = 18;
section(sh.Guide, "A25:H25", "이번 개정본에서 추가한 입력영역");
sh.Guide.getRange("A26:C31").values = [
  ["시트", "입력 대상", "주요 입력내용"],
  ["Master_Supplier", "Supplier 상세정보", "생산·선적·통관·국내운송 Lead Time, 발주마감, 운송수단, Incoterms, 분할납품/긴급발주"],
  ["Master_Policy", "발주 정책", "계획기간, 안전재고, 이월수요, Bulk Deal 반영기준, 재고차감/대체재고/PO 기준, PO Match 기준"],
  ["Master_Approval", "권한·승인", "역할별 담당자, 금액별 승인권자, Flex/MOQ 예외 승인자"],
  ["FXLIVE_Map", "FX-LIVE 연계", "입력필드, 원천컬럼, 필수여부, 데이터형식, 연계방식, 오류처리"],
  ["Input_Implementation", "구현 전 확인사항", "실제 파일·화면·인터페이스·업무정책의 확보 여부와 담당자/완료일"]
];
header(sh.Guide, "A26:C26"); body(sh.Guide, "A27:C31"); sh.Guide.getRange("A27:C31").format.wrapText = true;

// Master Rules
title(sh.Master_Rules, "기준정보: Supplier·Lead Time·MOQ·단가·Flexibility Rule", "N");
sh.Master_Rules.getRange("A3:N3").values = [["Supplier", "출발거점", "상품구분", "품목코드", "품목명", "단위", "MOQ", "발주단위", "Lead Time(일)", "단가", "통화", "전월 Flex", "전전월 Flex", "평균사용량 기준"]];
header(sh.Master_Rules, "A3:N3");
sh.Master_Rules.getRange("A4:N10").values = [
  ["Supplier A", "상해", "기기", "PRT-A3-001", "A3 Printer", "대", 10, 10, 45, 1000000, "KRW", 0.2, 0.3, "-"],
  ["Supplier B", "심천", "기기", "PRT-A4-001", "A4 Printer", "대", 20, 20, 45, 650000, "KRW", 0.2, 0.3, "-"],
  ["Supplier C", "베트남", "옵션", "OPT-FIN-001", "Finisher", "개", 5, 5, 60, 250000, "KRW", 0.2, 0.3, "-"],
  ["Supplier C", "베트남", "옵션", "OPT-TRAY-001", "Paper Tray", "개", 10, 10, 60, 80000, "KRW", 0.2, 0.3, "-"],
  ["Supplier D", "도쿄", "소모품", "CON-TNR-001", "Toner", "개", 50, 50, 30, 30000, "KRW", 0.2, 0.3, "3Month"],
  ["Supplier E", "네덜란드", "부품", "PART-001", "Maintenance Part", "개", 10, 10, 75, 50000, "KRW", 0.2, 0.3, "6Month"],
  ["", "", "", "", "", "", null, null, null, null, "", null, null, ""]
];
inputStyle(sh.Master_Rules, "A4:N10"); body(sh.Master_Rules, "A3:N10");
sh.Master_Rules.getRange("G4:I10").format.numberFormat = "#,##0"; sh.Master_Rules.getRange("J4:J10").format.numberFormat = "#,##0"; sh.Master_Rules.getRange("L4:M10").format.numberFormat = "0%";
sh.Master_Rules.getRange("A:A").format.columnWidth = 16; sh.Master_Rules.getRange("B:B").format.columnWidth = 12; sh.Master_Rules.getRange("C:C").format.columnWidth = 12; sh.Master_Rules.getRange("D:D").format.columnWidth = 16; sh.Master_Rules.getRange("E:E").format.columnWidth = 22; sh.Master_Rules.getRange("F:N").format.columnWidth = 14;
sh.Master_Rules.getRange("L4:M200").dataValidation = { rule: { type: "decimal", operator: "between", formula1: 0, formula2: 1 } };

// Detailed Supplier master
title(sh.Master_Supplier, "기준정보: Supplier·거점·물류 Lead Time", "Q");
sh.Master_Supplier.getRange("A3:Q3").values = [["Supplier코드", "Supplier명", "출발거점", "국가", "생산LT(일)", "현지출하LT(일)", "해상/항공LT(일)", "통관LT(일)", "국내운송LT(일)", "총LT(일)", "발주마감일", "운송수단", "Incoterms", "분할납품", "긴급발주", "담당자", "비고"]];
header(sh.Master_Supplier, "A3:Q3");
sh.Master_Supplier.getRange("A4:Q11").values = [
  ["SUP-A", "Supplier A", "상해", "중국", 20, 5, 15, 3, 2, null, "매월 5일", "해상", "FOB", "Y", "N", "", ""],
  ["SUP-B", "Supplier B", "심천", "중국", 20, 5, 15, 3, 2, null, "매월 5일", "해상", "FOB", "Y", "N", "", ""],
  ["SUP-C", "Supplier C", "베트남", "베트남", 30, 5, 15, 3, 2, null, "매월 10일", "해상", "FOB", "Y", "Y", "", ""],
  ["SUP-D", "Supplier D", "도쿄", "일본", 10, 2, 3, 2, 1, null, "매주 금요일", "항공", "CIP", "N", "Y", "", ""],
  ["SUP-E", "Supplier E", "네덜란드", "네덜란드", 35, 5, 25, 5, 2, null, "매월 1일", "해상", "CIF", "Y", "N", "", ""],
  ["", "", "홍콩", "홍콩", null, null, null, null, null, null, "", "", "", "", "", "", ""],
  ["", "", "요코하마", "일본", null, null, null, null, null, null, "", "", "", "", "", "", ""],
  ["", "", "나고야", "일본", null, null, null, null, null, "", "", "", "", "", "", "", ""]
];
sh.Master_Supplier.getRange("J4:J200").formulas = [["=IF(A4=\"\",\"\",SUM(E4:I4))"]]; sh.Master_Supplier.getRange("J4:J200").fillDown();
inputStyle(sh.Master_Supplier, "A4:I200"); formulaStyle(sh.Master_Supplier, "J4:J200"); inputStyle(sh.Master_Supplier, "K4:Q200"); body(sh.Master_Supplier, "A3:Q200");
sh.Master_Supplier.getRange("E4:J200").format.numberFormat = "#,##0"; sh.Master_Supplier.getRange("N4:O200").dataValidation = { rule: { type: "list", values: ["Y", "N"] } };
for (const [c,w] of [["A",14],["B",16],["C",12],["D",12],["E",12],["F",14],["G",14],["H",12],["I",14],["J",12],["K",15],["L",12],["M",12],["N",12],["O",12],["P",14],["Q",20]]) sh.Master_Supplier.getRange(`${c}:${c}`).format.columnWidth = w;

// Policy master / decisions to be confirmed
title(sh.Master_Policy, "정책 입력: 수요·재고·발주·예외·PO Match 기준", "F");
sh.Master_Policy.getRange("A3:F3").values = [["정책영역", "정책항목", "현재 적용값/선택값", "확정 필요 여부", "담당자", "비고"]]; header(sh.Master_Policy, "A3:F3");
sh.Master_Policy.getRange("A4:F25").values = [
  ["범위", "발주계획 기간", "당월/3개월/6개월/12개월", "확정 필요", "", ""], ["수요", "수요 우선순위", "수급회의 확정수요 > OL > SFDC > Trend", "확정 필요", "", "불일치 시 우선순위"], ["수요", "Bulk Deal 반영 수주가능성", "", "확정 필요", "", "% 기준 입력"], ["수요", "수요 확정 마감일", "", "확정 필요", "", "월별 마감일"], ["수요", "확정 후 수요변경 허용", "Y/N", "확정 필요", "", "변경 승인 여부"], ["재고", "예약재고 차감", "Y/N", "확정 필요", "", ""], ["재고", "품질보류/수리중 재고 차감", "Y/N", "확정 필요", "", ""], ["재고", "장기/불용재고 사용가능 처리", "Y/N", "확정 필요", "", ""], ["재고", "기종간 대체재고 인정", "Y/N", "확정 필요", "", "대체 매핑 필요"], ["재고", "Open PO 반영 기준", "필요월도 전 입고예정분", "확정 필요", "", "분할입고 포함 여부"], ["발주", "안전재고 적용", "Y/N", "확정 필요", "", "품목별 기준 필요"], ["발주", "이월 미충족수요 반영", "Y/N", "확정 필요", "", ""], ["발주", "Bulk Deal 선확보수량 반영", "Y/N", "확정 필요", "", ""], ["발주", "MOQ 초과발주 허용", "Y/N", "확정 필요", "", "초과 시 승인 여부"], ["Flex", "전월 OL 허용범위", 0.2, "확정 필요", "", "기본 ±20%"], ["Flex", "전전월 OL 허용범위", 0.3, "확정 필요", "", "기본 ±30%"], ["Flex", "Rule 초과 처리", "경고/차단/승인", "확정 필요", "", ""], ["옵션", "장착율 산정 기준", "3M/6M/12M/담당자입력", "확정 필요", "", ""], ["옵션", "옵션 수요 기준", "기기 판매/기기 발주", "확정 필요", "", ""], ["입고", "입고 수량 허용오차", "", "확정 필요", "", "% 또는 수량"], ["지급", "PO Match 방식", "2-way/3-way", "확정 필요", "", "PO-입고-Invoice"], ["지급", "불일치 시 지급 처리", "보류/부분지급/수동승인", "확정 필요", "", ""]
];
inputStyle(sh.Master_Policy, "A4:F25"); body(sh.Master_Policy, "A3:F25"); sh.Master_Policy.getRange("C4:F25").format.wrapText = true; sh.Master_Policy.getRange("C15:C16").format.numberFormat = "0%"; sh.Master_Policy.getRange("D4:D25").dataValidation = { rule: { type: "list", values: ["확정 필요", "확정", "적용 제외"] } };
for (const [c,w] of [["A",12],["B",26],["C",30],["D",14],["E",14],["F",28]]) sh.Master_Policy.getRange(`${c}:${c}`).format.columnWidth = w;

// Approval and responsibility matrix
title(sh.Master_Approval, "권한·승인 매트릭스", "H");
sh.Master_Approval.getRange("A3:H3").values = [["업무영역", "역할", "조직/부서", "담당자", "금액하한", "금액상한", "승인필요", "비고"]]; header(sh.Master_Approval, "A3:H3");
sh.Master_Approval.getRange("A4:H12").values = [
  ["OL", "영업 OL 입력", "영업부서", "", null, null, "N", ""], ["수요", "수급회의 수요확정", "SCM/영업", "", null, null, "Y", ""], ["발주", "발주량 산출·검토", "물류/SCM", "", null, null, "N", ""], ["보고", "사장 보고자료 작성", "SCM", "", null, null, "Y", ""], ["승인", "일반 발주 승인", "임원/사장", "", 0, 100000000, "Y", "실제 금액기준 입력"], ["승인", "고액 발주 승인", "사장", "", 100000000, null, "Y", "실제 금액기준 입력"], ["예외", "Flex Rule 초과 승인", "구매/임원", "", null, null, "Y", ""], ["발주", "FX-LIVE 입력/FIX", "구매", "", null, null, "Y", ""], ["입고", "PO Match/지급처리", "회계/구매", "", null, null, "Y", ""]
];
inputStyle(sh.Master_Approval, "A4:H12"); body(sh.Master_Approval, "A3:H12"); sh.Master_Approval.getRange("E4:F12").format.numberFormat = "#,##0"; sh.Master_Approval.getRange("G4:G12").dataValidation = { rule: { type: "list", values: ["Y", "N"] } };
for (const [c,w] of [["A",14],["B",24],["C",16],["D",14],["E",14],["F",14],["G",12],["H",24]]) sh.Master_Approval.getRange(`${c}:${c}`).format.columnWidth = w;

// FX-LIVE interface mapping
title(sh.FXLIVE_Map, "FX-LIVE 연계 정의: 입력필드·검증·오류처리", "J");
sh.FXLIVE_Map.getRange("A3:J3").values = [["FX-LIVE 필드명", "업무 의미", "원천 시트", "원천 컬럼", "필수 여부", "데이터형식", "예시값", "검증규칙", "연계방식", "오류처리"]]; header(sh.FXLIVE_Map, "A3:J3");
sh.FXLIVE_Map.getRange("A4:J14").values = [
  ["PO번호", "발주 식별번호", "Report_Approval/Inbound_PO", "승인번호/PO번호", "Y", "Text", "PO-202608-001", "중복불가", "API/업로드/수동", ""], ["Supplier코드", "Supplier 식별자", "Master_Supplier", "Supplier코드", "Y", "Text", "SUP-A", "기준정보 존재", "", ""], ["품목코드", "기기/옵션/부품 코드", "Calc_Device/Calc_Option", "기종코드/품목코드", "Y", "Text", "PRT-A3-001", "기준정보 존재", "", ""], ["발주수량", "최종 FIX 수량", "Calc_Device/Calc_Option", "최종 제안량/MOQ 적용 발주량", "Y", "Number", 30, ">=0", "", ""], ["필요월도", "고객 출고 예측월도", "Calc_Device/Calc_Option", "필요월도", "Y", "Date", new Date("2026-09-01"), "월 첫날", "", ""], ["단가", "구매단가", "Master_Rules", "단가", "Y", "Number", 1000000, ">=0", "", ""], ["통화", "금액 통화", "Master_Rules", "통화", "Y", "Text", "KRW", "코드유효", "", ""], ["납기요청일", "Supplier 요청 납기", "Calc_Device/Calc_Option", "입고 필요일", "Y", "Date", new Date("2026-09-25"), "Lead Time 검증", "", ""], ["발주금액", "발주수량×단가", "Calc_Device/Calc_Option", "발주금액", "Y", "Number", 30000000, "합계검증", "", ""], ["승인번호", "사장 승인 식별자", "Report_Approval", "승인자/승인일", "Y", "Text", "APR-001", "승인완료", "", ""], ["변경사유", "수량 조정 사유", "Report_Approval", "조정사유", "조건부", "Text", "Bulk Deal 반영", "Rule 초과 시 필수", "", ""]
];
inputStyle(sh.FXLIVE_Map, "A4:J14"); body(sh.FXLIVE_Map, "A3:J14"); sh.FXLIVE_Map.getRange("A4:J14").format.wrapText = true; sh.FXLIVE_Map.getRange("G7").format.numberFormat = "#,##0"; sh.FXLIVE_Map.getRange("G8").format.numberFormat = "yyyy-mm-dd"; sh.FXLIVE_Map.getRange("G9").format.numberFormat = "#,##0"; sh.FXLIVE_Map.getRange("G11").format.numberFormat = "yyyy-mm-dd"; sh.FXLIVE_Map.getRange("G12").format.numberFormat = "#,##0";
for (const [c,w] of [["A",18],["B",24],["C",24],["D",24],["E",12],["F",14],["G",18],["H",24],["I",16],["J",24]]) sh.FXLIVE_Map.getRange(`${c}:${c}`).format.columnWidth = w;

// Implementation checklist / requested source materials
title(sh.Input_Implementation, "구현 전 확인사항: 자료·정책·인터페이스 확보현황", "J");
sh.Input_Implementation.getRange("A3:J3").values = [["구분", "확인항목", "필요자료/결정내용", "현재상태", "자료명/시스템", "담당부서", "담당자", "확보일/확정일", "우선순위", "비고"]]; header(sh.Input_Implementation, "A3:J3");
sh.Input_Implementation.getRange("A4:J24").values = [
  ["범위", "발주대상 품목", "기기·옵션·부품·소모품 및 적용 법인/창고", "미확인", "", "", "", null, "High", ""], ["수요", "실제 OL 샘플", "최근 2~3개월 OL 원본", "미확보", "", "영업", "", null, "High", ""], ["수요", "SFDC/Bulk Deal 샘플", "Pipeline 및 Bulk Deal 원본", "미확보", "", "영업", "", null, "High", ""], ["수요", "수급회의 자료", "최근 회의자료·의사결정 기록", "미확보", "", "SCM", "", null, "High", ""], ["실적", "과거 실적 Trend", "월별 기종·품목 실적 3/6/12개월", "미확보", "", "SCM/영업", "", null, "Medium", ""], ["재고", "전월 말 재고", "재고상태별 수량 및 창고", "미확보", "", "물류", "", null, "High", ""], ["재고", "Open PO", "PO·잔량·예정입고일·분할입고", "미확보", "", "구매", "", null, "High", ""], ["기준", "BOM 원본", "기종-자재 관계 및 버전", "미확보", "", "기술/구매", "", null, "High", ""], ["기준", "장착율 원본", "기종·지역·고객별 장착율", "미확보", "", "영업/SCM", "", null, "High", ""], ["기준", "Supplier MOQ/LT", "Supplier별 계약·구매조건", "미확보", "", "구매", "", null, "High", ""], ["기준", "단가·환율", "단가 유효기간·통화·환율 기준일", "미확보", "", "구매/재무", "", null, "High", ""], ["보고", "사장 보고자료", "실제 보고서 양식 및 비교기준", "미확보", "", "SCM", "", null, "High", ""], ["승인", "결재선", "금액별 승인자 및 예외 승인자", "미확인", "", "관리/SCM", "", null, "High", ""], ["연계", "FX-LIVE 입력양식", "필수필드·업로드/API·오류처리", "미확보", "", "구매/IT", "", null, "High", ""], ["연계", "ERP/WMS 재고연계", "재고·입고·Open PO 인터페이스", "미확인", "", "IT/물류", "", null, "High", ""], ["물류", "선적·통관 관리자료", "B/L·AWB·Invoice·통관서류", "미확보", "", "물류/통관", "", null, "Medium", ""], ["입고", "검수 기준", "수량·상태·파손·Serial/Lot 기준", "미확인", "", "물류/품질", "", null, "Medium", ""], ["지급", "PO Match 기준", "2-way/3-way·허용오차·보류기준", "미확인", "", "재무/구매", "", null, "High", ""], ["보안", "권한·감사로그", "입력·수정·승인·FIX 이력", "미확인", "", "IT/SCM", "", null, "Medium", ""], ["운영", "월간 마감 캘린더", "OL 제출·수급회의·보고·발주 마감일", "미확인", "", "SCM", "", null, "High", ""], ["기타", "예외처리 목록", "긴급발주·공급중단·재고대체·반려", "미확인", "", "SCM/구매", "", null, "Medium", ""]
];
inputStyle(sh.Input_Implementation, "A4:J24"); body(sh.Input_Implementation, "A3:J24"); sh.Input_Implementation.getRange("A4:J24").format.wrapText = true; sh.Input_Implementation.getRange("H4:H24").format.numberFormat = "yyyy-mm-dd"; sh.Input_Implementation.getRange("D4:D24").dataValidation = { rule: { type: "list", values: ["미확인", "미확보", "확인중", "확보", "확정", "적용"] } }; sh.Input_Implementation.getRange("I4:I24").dataValidation = { rule: { type: "list", values: ["High", "Medium", "Low"] } };
for (const [c,w] of [["A",12],["B",22],["C",38],["D",14],["E",20],["F",16],["G",14],["H",14],["I",12],["J",24]]) sh.Input_Implementation.getRange(`${c}:${c}`).format.columnWidth = w;

// Input OL
title(sh.Input_OL, "입력: 영업부서별 OL", "N");
sh.Input_OL.getRange("A3:N3").values = [["기준월", "영업부서", "기종코드", "기종명", "상품구분", "필요월도", "OL 수량", "OL 버전", "검증상태", "수급회의 반영", "확정수요", "차이사유", "담당자", "비고"]];
header(sh.Input_OL, "A3:N3");
sh.Input_OL.getRange("A4:N8").values = [
  [new Date("2026-08-01"), "영업1팀", "PRT-A3-001", "A3 Printer", "기기", new Date("2026-09-01"), 40, "OL-202608-v1", "검증완료", "Y", 40, "", "홍길동", "예시"],
  [new Date("2026-08-01"), "영업1팀", "PRT-A4-001", "A4 Printer", "기기", new Date("2026-09-01"), 60, "OL-202608-v1", "검증완료", "Y", 60, "", "홍길동", "예시"],
  [new Date("2026-08-01"), "영업2팀", "PRT-A3-001", "A3 Printer", "기기", new Date("2026-10-01"), 30, "OL-202608-v1", "검증완료", "Y", 30, "", "김영업", ""],
  [new Date("2026-08-01"), "영업2팀", "PRT-A4-001", "A4 Printer", "기기", new Date("2026-10-01"), 20, "OL-202608-v1", "검증완료", "Y", 20, "", "김영업", ""],
  [new Date("2026-08-01"), "영업3팀", "PRT-A3-001", "A3 Printer", "기기", new Date("2026-09-01"), 10, "OL-202608-v1", "검토필요", "N", 0, "Bulk Deal 확인 중", "이영업", ""]
];
inputStyle(sh.Input_OL, "A4:N200"); body(sh.Input_OL, "A3:N200"); sh.Input_OL.freezePanes.freezeRows(3);
sh.Input_OL.getRange("A4:A200").format.numberFormat = "yyyy-mm-dd"; sh.Input_OL.getRange("F4:F200").format.numberFormat = "yyyy-mm-dd"; sh.Input_OL.getRange("G4:K200").format.numberFormat = "#,##0";
sh.Input_OL.getRange("I4:I200").dataValidation = { rule: { type: "list", values: ["검증완료", "검토필요", "수정요청"] } };
sh.Input_OL.getRange("J4:J200").dataValidation = { rule: { type: "list", values: ["Y", "N"] } };
for (const [c,w] of [["A",13],["B",14],["C",16],["D",20],["E",12],["F",13],["G",12],["H",18],["I",14],["J",14],["K",12],["L",24],["M",12],["N",16]]) sh.Input_OL.getRange(`${c}:${c}`).format.columnWidth = w;

// Input SFDC
title(sh.Input_SFDC, "입력: SFDC 중요 파이프라인 및 OL 외 Bulk Deal", "M");
sh.Input_SFDC.getRange("A3:M3").values = [["구분", "기회/Deal명", "고객명", "기종코드", "기종명", "예상출고월도", "수량", "수주가능성", "OL 반영여부", "사전재고 확보", "결정상태", "담당자", "비고"]];
header(sh.Input_SFDC, "A3:M3");
sh.Input_SFDC.getRange("A4:M6").values = [
  ["SFDC", "Pipeline-001", "고객A", "PRT-A3-001", "A3 Printer", new Date("2026-09-01"), 15, 0.8, "Y", "N", "검토", "영업1팀", ""],
  ["Bulk Deal", "Bulk-Deal-001", "고객B", "PRT-A4-001", "A4 Printer", new Date("2026-10-01"), 30, 0.6, "N", "Y", "회의결정필요", "영업2팀", "사전확보 검토"],
  ["SFDC", "Pipeline-002", "고객C", "PRT-A4-001", "A4 Printer", new Date("2026-11-01"), 20, 0.5, "N", "N", "참고", "영업3팀", ""]
];
inputStyle(sh.Input_SFDC, "A4:M100"); body(sh.Input_SFDC, "A3:M100"); sh.Input_SFDC.getRange("F4:F100").format.numberFormat = "yyyy-mm-dd"; sh.Input_SFDC.getRange("G4:G100").format.numberFormat = "#,##0"; sh.Input_SFDC.getRange("H4:H100").format.numberFormat = "0%";
sh.Input_SFDC.getRange("A4:A100").dataValidation = { rule: { type: "list", values: ["SFDC", "Bulk Deal"] } }; sh.Input_SFDC.getRange("I4:J100").dataValidation = { rule: { type: "list", values: ["Y", "N"] } }; sh.Input_SFDC.getRange("K4:K100").dataValidation = { rule: { type: "list", values: ["검토", "회의결정필요", "확정", "제외", "참고"] } };
for (const [c,w] of [["A",12],["B",18],["C",16],["D",16],["E",20],["F",14],["G",12],["H",12],["I",14],["J",14],["K",16],["L",14],["M",24]]) sh.Input_SFDC.getRange(`${c}:${c}`).format.columnWidth = w;

// Inventory
title(sh.Input_Inventory, "입력: 전월 말 재고 및 Open PO", "N");
sh.Input_Inventory.getRange("A3:N3").values = [["기준월", "구분", "품목코드", "품목명", "Supplier", "필요월도", "전월 말 재고", "예약/출고예정", "보류재고", "Open PO 수량", "Open PO 입고예정일", "필요월도 전 입고", "가용재고", "비고"]];
header(sh.Input_Inventory, "A3:N3");
sh.Input_Inventory.getRange("A4:N9").values = [
  [new Date("2026-07-31"), "기기", "PRT-A3-001", "A3 Printer", "Supplier A", new Date("2026-09-01"), 12, 2, 0, 10, new Date("2026-08-25"), null, null, "예시"],
  [new Date("2026-07-31"), "기기", "PRT-A4-001", "A4 Printer", "Supplier B", new Date("2026-09-01"), 25, 5, 0, 20, new Date("2026-09-20"), null, null, "예시"],
  [new Date("2026-07-31"), "옵션", "OPT-FIN-001", "Finisher", "Supplier C", new Date("2026-09-01"), 3, 0, 0, 5, new Date("2026-08-30"), null, null, "예시"],
  [new Date("2026-07-31"), "옵션", "OPT-TRAY-001", "Paper Tray", "Supplier C", new Date("2026-09-01"), 4, 0, 0, 10, new Date("2026-09-25"), null, null, "예시"],
  [new Date("2026-07-31"), "소모품", "CON-TNR-001", "Toner", "Supplier D", new Date("2026-09-01"), 80, 0, 5, 0, null, null, null, "예시"],
  [new Date("2026-07-31"), "부품", "PART-001", "Maintenance Part", "Supplier E", new Date("2026-09-01"), 12, 0, 0, 0, null, null, null, "예시"]
];
sh.Input_Inventory.getRange("L4:L200").formulas = [["=IF(K4=\"\",0,IF(K4<=F4,J4,0))"]]; sh.Input_Inventory.getRange("L4:L200").fillDown();
sh.Input_Inventory.getRange("M4:M200").formulas = [["=G4-H4-I4+L4"]]; sh.Input_Inventory.getRange("M4:M200").fillDown();
inputStyle(sh.Input_Inventory, "A4:K200"); formulaStyle(sh.Input_Inventory, "L4:M200"); body(sh.Input_Inventory, "A3:N200"); sh.Input_Inventory.freezePanes.freezeRows(3);
for (const c of ["A","F","K"]) sh.Input_Inventory.getRange(`${c}4:${c}200`).format.numberFormat = "yyyy-mm-dd"; sh.Input_Inventory.getRange("G4:M200").format.numberFormat = "#,##0";
for (const [c,w] of [["A",13],["B",12],["C",16],["D",22],["E",14],["F",13],["G",12],["H",14],["I",12],["J",12],["K",16],["L",12],["M",12],["N",16]]) sh.Input_Inventory.getRange(`${c}:${c}`).format.columnWidth = w;

// BOM
title(sh.Master_BOM, "기준정보: BOM·장착율·필수 옵션·Common품", "M");
sh.Master_BOM.getRange("A3:M3").values = [["기종코드", "기종명", "옵션/부품코드", "옵션/부품명", "자재구분", "BOM 수량", "장착율", "필수품 여부", "Common품 여부", "평균사용량 3M", "평균사용량 6M", "평균사용량 12M", "적용 평균기준"]];
header(sh.Master_BOM, "A3:M3");
sh.Master_BOM.getRange("A4:M8").values = [
  ["PRT-A3-001", "A3 Printer", "OPT-FIN-001", "Finisher", "옵션", 1, 0.4, "N", "Y", 0, 0, 0, "-"],
  ["PRT-A3-001", "A3 Printer", "OPT-TRAY-001", "Paper Tray", "옵션", 1, 1, "Y", "Y", 0, 0, 0, "-"],
  ["PRT-A4-001", "A4 Printer", "OPT-FIN-001", "Finisher", "옵션", 1, 0.3, "N", "Y", 0, 0, 0, "-"],
  ["PRT-A4-001", "A4 Printer", "OPT-TRAY-001", "Paper Tray", "옵션", 1, 1, "Y", "Y", 0, 0, 0, "-"],
  ["PRT-A3-001", "A3 Printer", "CON-TNR-001", "Toner", "소모품", 1, 1, "N", "Y", 90, 180, 360, "3Month"]
];
inputStyle(sh.Master_BOM, "A4:M200"); body(sh.Master_BOM, "A3:M200"); sh.Master_BOM.getRange("F4:F200").format.numberFormat = "#,##0.0"; sh.Master_BOM.getRange("G4:G200").format.numberFormat = "0%"; sh.Master_BOM.getRange("J4:L200").format.numberFormat = "#,##0";
sh.Master_BOM.getRange("G4:G200").dataValidation = { rule: { type: "decimal", operator: "between", formula1: 0, formula2: 1 } }; sh.Master_BOM.getRange("H4:I200").dataValidation = { rule: { type: "list", values: ["Y", "N"] } };
for (const [c,w] of [["A",16],["B",20],["C",18],["D",22],["E",12],["F",12],["G",12],["H",14],["I",14],["J",14],["K",14],["L",14],["M",14]]) sh.Master_BOM.getRange(`${c}:${c}`).format.columnWidth = w;

// Calc Device
title(sh.Calc_Device, "계산: 기기 발주량 산출", "T");
sh.Calc_Device.getRange("A3:T3").values = [["기준월", "필요월도", "기종코드", "기종명", "Supplier", "확정수요", "전월 말 재고", "Open PO(적기)", "가용재고", "기본 필요량", "MOQ", "발주단위", "MOQ 적용 발주량", "전월 OL", "전전월 OL", "전월 Flex 결과", "전전월 Flex 결과", "최종 제안량", "발주금액", "리스크/调整사유"]];
header(sh.Calc_Device, "A3:T3");
sh.Calc_Device.getRange("A4:E7").values = [
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A3-001", "A3 Printer", "Supplier A"],
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A4-001", "A4 Printer", "Supplier B"],
  [new Date("2026-08-01"), new Date("2026-10-01"), "PRT-A3-001", "A3 Printer", "Supplier A"],
  [new Date("2026-08-01"), new Date("2026-10-01"), "PRT-A4-001", "A4 Printer", "Supplier B"]
];
const deviceFormulas = [
  ["=SUMIFS('Input_OL'!$K$4:$K$200,'Input_OL'!$C$4:$C$200,C4,'Input_OL'!$F$4:$F$200,B4)","=SUMIFS('Input_Inventory'!$G$4:$G$200,'Input_Inventory'!$C$4:$C$200,C4)","=SUMIFS('Input_Inventory'!$L$4:$L$200,'Input_Inventory'!$C$4:$C$200,C4,'Input_Inventory'!$F$4:$F$200,B4)","=G4+H4","=MAX(0,F4-I4)","=SUMIFS('Master_Rules'!$G$4:$G$200,'Master_Rules'!$D$4:$D$200,C4)","=SUMIFS('Master_Rules'!$H$4:$H$200,'Master_Rules'!$D$4:$D$200,C4)","=IF(K4=0,J4,MAX(K4,CEILING(J4,L4)))","=SUMIFS('Input_OL'!$G$4:$G$200,'Input_OL'!$C$4:$C$200,C4,'Input_OL'!$F$4:$F$200,B4)","=SUMIFS('Input_OL'!$G$4:$G$200,'Input_OL'!$C$4:$C$200,C4,'Input_OL'!$F$4:$F$200,B4)","=IF(N4=0,\"확인필요\",IF(ABS(M4-N4)/N4<=0.2,\"정상\",\"Rule초과\"))","=IF(O4=0,\"확인필요\",IF(ABS(M4-O4)/O4<=0.3,\"정상\",\"Rule초과\"))","=M4","=R4*SUMIFS('Master_Rules'!$J$4:$J$200,'Master_Rules'!$D$4:$D$200,C4)","=IF(OR(P4=\"Rule초과\",Q4=\"Rule초과\"),\"Flex 확인\",IF(R4>J4,\"MOQ 조정\",\"정상\"))"]
];
sh.Calc_Device.getRange("F4:T4").formulas = [deviceFormulas[0].map(f => `=IF($C4="","",${f.substring(1)})`)]; sh.Calc_Device.getRange("F4:T200").fillDown();
formulaStyle(sh.Calc_Device, "F4:S200"); inputStyle(sh.Calc_Device, "A4:E200"); inputStyle(sh.Calc_Device, "T4:T200"); body(sh.Calc_Device, "A3:T200"); sh.Calc_Device.freezePanes.freezeRows(3);
sh.Calc_Device.getRange("A4:B200").format.numberFormat = "yyyy-mm-dd"; sh.Calc_Device.getRange("F4:R200").format.numberFormat = "#,##0"; sh.Calc_Device.getRange("S4:S200").format.numberFormat = "#,##0";
for (const [c,w] of [["A",13],["B",13],["C",16],["D",20],["E",14],["F",12],["G",12],["H",12],["I",12],["J",12],["K",10],["L",10],["M",14],["N",12],["O",12],["P",14],["Q",16],["R",12],["S",14],["T",18]]) sh.Calc_Device.getRange(`${c}:${c}`).format.columnWidth = w;
sh.Calc_Device.getRange("P4:Q200").conditionalFormats.add("containsText", { text: "Rule초과", format: { fill: colors.red, font: { color: "#9C0006", bold: true } } });

// Calc Option
title(sh.Calc_Option, "계산: 옵션·부품·소모품 발주량 산출", "V");
sh.Calc_Option.getRange("A3:V3").values = [["기준월", "필요월도", "기종코드", "기종명", "품목코드", "품목명", "Supplier", "기기수요", "BOM", "장착율", "필수품", "기기연동 소요량", "평균사용량", "총 소요량", "전월 말 재고", "Open PO(적기)", "가용재고", "기본 필요량", "MOQ", "MOQ 적용 발주량", "발주금액", "검증결과"]];
header(sh.Calc_Option, "A3:V3");
sh.Calc_Option.getRange("A4:G8").values = [
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A3-001", "A3 Printer", "OPT-FIN-001", "Finisher", "Supplier C"],
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A3-001", "A3 Printer", "OPT-TRAY-001", "Paper Tray", "Supplier C"],
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A4-001", "A4 Printer", "OPT-FIN-001", "Finisher", "Supplier C"],
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A4-001", "A4 Printer", "OPT-TRAY-001", "Paper Tray", "Supplier C"],
  [new Date("2026-08-01"), new Date("2026-09-01"), "PRT-A3-001", "A3 Printer", "CON-TNR-001", "Toner", "Supplier D"]
];
const optionFormulaRow = [[
  "=SUMIFS('Input_OL'!$K$4:$K$200,'Input_OL'!$C$4:$C$200,C4,'Input_OL'!$F$4:$F$200,B4)",
  "=SUMIFS('Master_BOM'!$F$4:$F$200,'Master_BOM'!$A$4:$A$200,C4,'Master_BOM'!$C$4:$C$200,E4)",
  "=SUMIFS('Master_BOM'!$G$4:$G$200,'Master_BOM'!$A$4:$A$200,C4,'Master_BOM'!$C$4:$C$200,E4)",
  "=SUMIFS('Master_BOM'!$H$4:$H$200,'Master_BOM'!$A$4:$A$200,C4,'Master_BOM'!$C$4:$C$200,E4)",
  "=IF(K4=\"Y\",H4*I4,H4*I4*J4)",
  "=IFERROR(SUMIFS('Master_BOM'!$J$4:$J$200,'Master_BOM'!$C$4:$C$200,E4),0)",
  "=L4+M4",
  "=SUMIFS('Input_Inventory'!$G$4:$G$200,'Input_Inventory'!$C$4:$C$200,E4)",
  "=SUMIFS('Input_Inventory'!$L$4:$L$200,'Input_Inventory'!$C$4:$C$200,E4,'Input_Inventory'!$F$4:$F$200,B4)",
  "=O4+P4",
  "=MAX(0,N4-Q4)",
  "=SUMIFS('Master_Rules'!$G$4:$G$200,'Master_Rules'!$D$4:$D$200,E4)",
  "=IF(S4=0,R4,MAX(S4,CEILING(R4,SUMIFS('Master_Rules'!$H$4:$H$200,'Master_Rules'!$D$4:$D$200,E4))))",
  "=T4*SUMIFS('Master_Rules'!$J$4:$J$200,'Master_Rules'!$D$4:$D$200,E4)",
  "=IF(T4>R4,\"MOQ 조정\",IF(K4=\"Y\",\"필수품 확인\",\"정상\"))"
]];
sh.Calc_Option.getRange("H4:V4").formulas = [optionFormulaRow[0].map(f => `=IF($E4="","",${f.substring(1)})`)];
sh.Calc_Option.getRange("H4:V200").fillDown();
formulaStyle(sh.Calc_Option, "H4:V200"); inputStyle(sh.Calc_Option, "A4:G200"); body(sh.Calc_Option, "A3:V200"); sh.Calc_Option.freezePanes.freezeRows(3);
sh.Calc_Option.getRange("A4:B200").format.numberFormat = "yyyy-mm-dd"; sh.Calc_Option.getRange("H4:I200").format.numberFormat = "#,##0.0"; sh.Calc_Option.getRange("J4:J200").format.numberFormat = "0%"; sh.Calc_Option.getRange("L4:T200").format.numberFormat = "#,##0"; sh.Calc_Option.getRange("U4:U200").format.numberFormat = "#,##0";
for (const [c,w] of [["A",13],["B",13],["C",16],["D",20],["E",18],["F",22],["G",14],["H",12],["I",10],["J",10],["K",10],["L",14],["M",12],["N",12],["O",12],["P",12],["Q",12],["R",12],["S",10],["T",14],["U",14],["V",16]]) sh.Calc_Option.getRange(`${c}:${c}`).format.columnWidth = w;

// Report approval
title(sh.Report_Approval, "보고: 발주금액·전월/전년·OL 비교 및 승인", "P");
section(sh.Report_Approval, "A3:P3", "경영진 요약");
sh.Report_Approval.getRange("A4:H6").values = [["항목", "당월", "전월", "작년 동월", "당월-전월", "당월-작년 동월", "증감률(전월)", "비고"], ["기기 발주금액", null, null, null, null, null, null, "자동 집계",],["옵션/부품/소모품 발주금액", null, null, null, null, null, null, "자동 집계"]];
header(sh.Report_Approval, "A4:H4");
sh.Report_Approval.getRange("B5:B6").formulas = [["=SUM('Calc_Device'!$S$4:$S$200)"],["=SUM('Calc_Option'!$U$4:$U$200)"]]; sh.Report_Approval.getRange("E5:G6").formulas = [["=B5-C5","=B5-D5","=IFERROR(E5/C5,0)"],["=B6-C6","=B6-D6","=IFERROR(E6/C6,0)"]];
sh.Report_Approval.getRange("C5:D6").values = [[0,0],[0,0]];
sh.Report_Approval.getRange("A8:P8").values = [["분석항목", "기기", "옵션/부품/소모품", "합계", "전월 OL", "현재 제안량", "차이수량", "차이금액", "주요 차이사유", "사장 승인상태", "승인일", "승인자", "FX-LIVE 입력상태", "검증결과", "담당자", "비고"]];
header(sh.Report_Approval, "A8:P8");
sh.Report_Approval.getRange("A9:P11").values = [["발주량", null, null, null, null, null, null, null, "", "대기", null, "", "대기", "", "", ""],["발주금액", null, null, null, null, null, null, null, "", "대기", null, "", "대기", "", "", ""],["주요 리스크", null, null, null, null, null, null, null, "", "대기", null, "", "대기", "", "", ""]];
sh.Report_Approval.getRange("B9:B10").formulas = [["=SUM('Calc_Device'!$R$4:$R$200)"],["=SUM('Calc_Device'!$S$4:$S$200)"]]; sh.Report_Approval.getRange("C9:C10").formulas = [["=SUM('Calc_Option'!$T$4:$T$200)"],["=SUM('Calc_Option'!$U$4:$U$200)"]]; sh.Report_Approval.getRange("D9:D10").formulas = [["=B9+C9"],["=B10+C10"]]; sh.Report_Approval.getRange("F9:F10").formulas = [["=D9"],["=D10"]]; sh.Report_Approval.getRange("G9:G10").formulas = [["=F9-E9"],["=F10-E10"]]; sh.Report_Approval.getRange("H10").formulas = [["=B10+C10"]];
sh.Report_Approval.getRange("A13:P13").values = [["품목코드", "품목명", "구분", "Supplier", "발주수량", "단가", "발주금액", "전월 OL", "차이수량", "Flex 결과", "MOQ 결과", "리스크", "승인상태", "조정사유", "담당자", "비고"]]; header(sh.Report_Approval, "A13:P13");
sh.Report_Approval.getRange("A14:P18").values = [
  ["PRT-A3-001", "A3 Printer", "기기", "Supplier A", null, null, null, null, null, null, null, null, "대기", "", "", ""],
  ["PRT-A4-001", "A4 Printer", "기기", "Supplier B", null, null, null, null, null, null, null, null, "대기", "", "", ""],
  ["OPT-FIN-001", "Finisher", "옵션", "Supplier C", null, null, null, null, null, null, null, null, "대기", "", "", ""],
  ["OPT-TRAY-001", "Paper Tray", "옵션", "Supplier C", null, null, null, null, null, null, null, null, "대기", "", "", ""],
  ["CON-TNR-001", "Toner", "소모품", "Supplier D", null, null, null, null, null, null, null, null, "대기", "", "", ""]
];
sh.Report_Approval.getRange("E14:P14").formulas = [["=SUMIFS('Calc_Device'!$R$4:$R$200,'Calc_Device'!$C$4:$C$200,A14)+SUMIFS('Calc_Option'!$T$4:$T$200,'Calc_Option'!$E$4:$E$200,A14)","=SUMIFS('Master_Rules'!$J$4:$J$200,'Master_Rules'!$D$4:$D$200,A14)","=E14*F14","=SUMIFS('Input_OL'!$G$4:$G$200,'Input_OL'!$C$4:$C$200,A14)","=E14-H14","=IF(C14=\"기기\",IFERROR(INDEX('Calc_Device'!$P$4:$P$200,MATCH(A14,'Calc_Device'!$C$4:$C$200,0)),\"확인\"),\"옵션 별도 확인\")","=IF(E14>=SUMIFS('Master_Rules'!$G$4:$G$200,'Master_Rules'!$D$4:$D$200,A14),\"MOQ충족\",\"MOQ확인\")","=IF(OR(J14=\"Rule초과\",K14=\"MOQ확인\"),\"확인필요\",\"정상\")",null,null,null,null]];
sh.Report_Approval.getRange("E14:P18").fillDown();
formulaStyle(sh.Report_Approval, "B5:B6"); formulaStyle(sh.Report_Approval, "E5:G6"); formulaStyle(sh.Report_Approval, "B9:H10"); formulaStyle(sh.Report_Approval, "E14:L18"); inputStyle(sh.Report_Approval, "C5:D6"); inputStyle(sh.Report_Approval, "I9:P11"); inputStyle(sh.Report_Approval, "M14:P18"); body(sh.Report_Approval, "A4:H6"); body(sh.Report_Approval, "A8:P11"); body(sh.Report_Approval, "A13:P18");
sh.Report_Approval.getRange("B5:F6").format.numberFormat = "#,##0"; sh.Report_Approval.getRange("G5:G6").format.numberFormat = "0.0%"; sh.Report_Approval.getRange("B9:H10").format.numberFormat = "#,##0"; sh.Report_Approval.getRange("E14:I18").format.numberFormat = "#,##0"; sh.Report_Approval.getRange("F14:G18").format.numberFormat = "#,##0"; sh.Report_Approval.getRange("K14:K18").format.numberFormat = "@";
sh.Report_Approval.getRange("J9:J11").dataValidation = { rule: { type: "list", values: ["대기", "승인", "조건부 승인", "반려", "재산출"] } }; sh.Report_Approval.getRange("M9:M11").dataValidation = { rule: { type: "list", values: ["대기", "입력완료", "FIX완료", "오류"] } }; sh.Report_Approval.getRange("M14:M18").dataValidation = { rule: { type: "list", values: ["대기", "승인", "반려"] } };
for (const [c,w] of [["A",18],["B",20],["C",14],["D",14],["E",12],["F",12],["G",14],["H",12],["I",18],["J",14],["K",12],["L",14],["M",14],["N",20],["O",12],["P",16]]) sh.Report_Approval.getRange(`${c}:${c}`).format.columnWidth = w;

// Inbound PO
title(sh.Inbound_PO, "입고관리: 발주·선적·통관·입고·검수·PO Match", "W");
sh.Inbound_PO.getRange("A3:W3").values = [["PO번호", "Supplier", "출발거점", "품목코드", "품목명", "구분", "발주수량", "발주일", "현지선적일", "운송수단", "도착예정일", "도착지", "통관서류", "통관상태", "창고입고예정", "실제입고일", "입고수량", "검수결과", "Invoice번호", "Invoice금액", "PO Match", "지급상태", "지연/이상사유"]];
header(sh.Inbound_PO, "A3:W3");
sh.Inbound_PO.getRange("A4:W6").values = [
  ["PO-202608-001", "Supplier A", "상해", "PRT-A3-001", "A3 Printer", "기기", 30, new Date("2026-08-05"), null, "해상", new Date("2026-09-20"), "부산항", "확보", "준비중", new Date("2026-09-25"), null, null, "미검수", "", null, "대기", "대기", ""],
  ["PO-202608-002", "Supplier C", "베트남", "OPT-FIN-001", "Finisher", "옵션", 10, new Date("2026-08-05"), null, "해상", new Date("2026-10-05"), "인천항", "미확보", "대기", new Date("2026-10-10"), null, null, "미검수", "", null, "대기", "대기", "선적 일정 확인 필요"],
  ["PO-202608-003", "Supplier D", "도쿄", "CON-TNR-001", "Toner", "소모품", 100, new Date("2026-08-05"), new Date("2026-08-10"), "항공", new Date("2026-08-12"), "인천공항", "확보", "완료", new Date("2026-08-13"), new Date("2026-08-13"), 100, "정상", "INV-001", 3000000, "일치", "지급완료", "예시"]
];
inputStyle(sh.Inbound_PO, "A4:W200"); body(sh.Inbound_PO, "A3:W200"); sh.Inbound_PO.freezePanes.freezeRows(3);
for (const c of ["H","I","K","O","P"]) sh.Inbound_PO.getRange(`${c}4:${c}200`).format.numberFormat = "yyyy-mm-dd"; sh.Inbound_PO.getRange("G4:G200").format.numberFormat = "#,##0"; sh.Inbound_PO.getRange("Q4:Q200").format.numberFormat = "#,##0"; sh.Inbound_PO.getRange("T4:T200").format.numberFormat = "#,##0";
sh.Inbound_PO.getRange("N4:N200").dataValidation = { rule: { type: "list", values: ["대기", "준비중", "완료", "보류"] } }; sh.Inbound_PO.getRange("R4:R200").dataValidation = { rule: { type: "list", values: ["미검수", "정상", "이상"] } }; sh.Inbound_PO.getRange("U4:U200").dataValidation = { rule: { type: "list", values: ["대기", "일치", "불일치", "보류"] } }; sh.Inbound_PO.getRange("V4:V200").dataValidation = { rule: { type: "list", values: ["대기", "지급완료", "지급보류"] } };
for (const [c,w] of [["A",17],["B",14],["C",12],["D",18],["E",20],["F",12],["G",12],["H",12],["I",12],["J",10],["K",13],["L",12],["M",12],["N",12],["O",14],["P",13],["Q",12],["R",12],["S",16],["T",14],["U",12],["V",12],["W",24]]) sh.Inbound_PO.getRange(`${c}:${c}`).format.columnWidth = w;
sh.Inbound_PO.getRange("N4:N200").conditionalFormats.add("containsText", { text: "보류", format: { fill: colors.red, font: { color: "#9C0006", bold: true } } }); sh.Inbound_PO.getRange("U4:U200").conditionalFormats.add("containsText", { text: "불일치", format: { fill: colors.red, font: { color: "#9C0006", bold: true } } });

// Dashboard
title(sh.Dashboard, "SCM 발주·입고 운영 Dashboard", "L");
section(sh.Dashboard, "A3:L3", "핵심 KPI");
sh.Dashboard.getRange("A4:L5").values = [["KPI", "값", "설명", null, "KPI", "값", "설명", null, "KPI", "값", "설명", null], ["총 발주금액", null, "기기+옵션/부품/소모품", null, "총 발주수량", null, "기기+옵션 수량", null, "Flex Rule 초과", null, "초과 행 수", null]];
sh.Dashboard.getRange("B5").formulas = [["='Report_Approval'!D10"]]; sh.Dashboard.getRange("F5").formulas = [["='Report_Approval'!D9"]]; sh.Dashboard.getRange("J5").formulas = [["=COUNTIF('Calc_Device'!$P$4:$P$200,\"Rule초과\")+COUNTIF('Calc_Device'!$Q$4:$Q$200,\"Rule초과\")"]];
for (const r of ["A4:C5","E4:G5","I4:K5"]) { sh.Dashboard.getRange(r).format = { fill: colors.blue, borders: { preset: "outside", style: "medium", color: colors.navy }, wrapText: true }; }
sh.Dashboard.getRange("A4:K4").format = { fill: colors.navy, font: { bold: true, color: colors.white }, horizontalAlignment: "center" }; sh.Dashboard.getRange("B5").format.numberFormat = "#,##0"; sh.Dashboard.getRange("F5").format.numberFormat = "#,##0"; sh.Dashboard.getRange("J5").format.numberFormat = "#,##0";
section(sh.Dashboard, "A8:F8", "리스크 요약");
sh.Dashboard.getRange("A9:F14").values = [["리스크", "건수", "기준", "자동확인", "조치담당", "비고"], ["Flex Rule 초과", null, "전월 ±20% / 전전월 ±30%", "자동", "", ""], ["MOQ 조정", null, "MOQ/발주단위 미만 필요량", "자동", "", ""], ["입고 지연/보류", null, "통관·선적·입고 상태", "수동", "", ""], ["PO Match 불일치", null, "PO·입고·Invoice 대조", "수동", "", ""], ["필수 옵션 확인", null, "기기 출하 필수품", "자동", "", ""]];
header(sh.Dashboard, "A9:F9"); sh.Dashboard.getRange("B10:B14").formulas = [["=COUNTIF('Calc_Device'!$P$4:$P$200,\"Rule초과\")+COUNTIF('Calc_Device'!$Q$4:$Q$200,\"Rule초과\")"],["=COUNTIF('Calc_Device'!$T$4:$T$200,\"MOQ 조정\")+COUNTIF('Calc_Option'!$V$4:$V$200,\"MOQ 조정\")"],["=COUNTIF('Inbound_PO'!$N$4:$N$200,\"보류\")+COUNTIF('Inbound_PO'!$R$4:$R$200,\"이상\")"],["=COUNTIF('Inbound_PO'!$U$4:$U$200,\"불일치\")"],["=COUNTIF('Calc_Option'!$V$4:$V$200,\"필수품 확인\")"]]; formulaStyle(sh.Dashboard, "B10:B14"); body(sh.Dashboard, "A9:F14");
sh.Dashboard.getRange("A16:D16").values = [["구분", "발주금액", "비중", "비고"]]; header(sh.Dashboard, "A16:D16"); sh.Dashboard.getRange("A17:A18").values = [["기기"],["옵션/부품/소모품"]]; sh.Dashboard.getRange("B17:B18").formulas = [["='Report_Approval'!B10"],["='Report_Approval'!C10"]]; sh.Dashboard.getRange("C17:C18").formulas = [["=IFERROR(B17/SUM($B$17:$B$18),0)"],["=IFERROR(B18/SUM($B$17:$B$18),0)"]]; body(sh.Dashboard, "A16:D18"); formulaStyle(sh.Dashboard, "B17:C18"); sh.Dashboard.getRange("B17:B18").format.numberFormat = "#,##0"; sh.Dashboard.getRange("C17:C18").format.numberFormat = "0.0%";
const chart = sh.Dashboard.charts.add("bar", sh.Dashboard.getRange("A16:B18")); chart.title = "발주금액 구성"; chart.hasLegend = false; chart.setPosition("H8", "L20");
for (const [c,w] of [["A",18],["B",14],["C",24],["D",14],["E",18],["F",14],["G",24],["H",4],["I",18],["J",14],["K",22],["L",4]]) sh.Dashboard.getRange(`${c}:${c}`).format.columnWidth = w;

// Common formatting and tabular styling
for (const s of Object.values(sh)) {
  const used = s.getUsedRange();
  if (used) { used.format.font = { name: "Aptos", size: 10 }; }
}
// restore title font after global body font
for (const s of Object.values(sh)) s.getRange("A1").format.font = { name: "Aptos Display", size: 16, bold: true, color: colors.white };

// Add comments to key assumptions for auditability
wb.comments.setSelf({ displayName: "SCM 운영팀" });
wb.comments.addThread({ cell: sh.Master_Rules.getRange("L4") }, "Flexibility Rule 기본값: 전월 OL 대비 ±20%. 실제 Supplier별 계약 기준이 있으면 기준정보를 수정하십시오.");
wb.comments.addThread({ cell: sh.Master_Rules.getRange("M4") }, "Flexibility Rule 기본값: 전전월 OL 대비 ±30%. 실제 Supplier별 계약 기준이 있으면 기준정보를 수정하십시오.");
wb.comments.addThread({ cell: sh.Calc_Device.getRange("J4") }, "기본 필요량 = 확정 수요 - 가용재고. 필요 시 안전재고, 이월수요, Bulk Deal 확보수량을 별도 열로 확장하십시오.");
wb.comments.addThread({ cell: sh.Calc_Option.getRange("L4") }, "필수품은 장착율을 적용하지 않고 BOM 기준으로 계산하며, 선택품은 장착율을 적용합니다.");

const check = await wb.inspect({ kind: "table", range: "Dashboard!A1:L20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 12 });
console.log(check.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" });
console.log(errors.ndjson);
for (const sheetName of ["Guide", "Master_Supplier", "Master_Policy", "Master_Approval", "FXLIVE_Map", "Input_Implementation", "Calc_Device", "Calc_Option", "Report_Approval", "Inbound_PO", "Dashboard"]) {
  const preview = await wb.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(`${outputDir}/SCM_발주계획_운영양식.xlsx`);
console.log(`SAVED ${outputDir}/SCM_발주계획_운영양식.xlsx`);
