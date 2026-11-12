const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  ImageRun,
  ShadingType,
  SectionType
} = require('docx');

// Colors matching academic standard in Finale finale.docx
const COLOR_PRIMARY = '2E74B5';   // Navy / Blue (H1)
const COLOR_SECONDARY = '0F7B8C'; // Teal / Petrol (H2)
const COLOR_TERTIARY = '1A6B3A';  // Dark Green (H3)
const COLOR_DARK = '1E293B';      // Body text dark
const COLOR_MUTED = '64748B';     // Muted gray
const COLOR_BG_HEADER = 'F1F5F9'; // Header row background
const COLOR_BORDER = 'CBD5E1';    // Table border

const FONT_BODY = 'Times New Roman';

function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 180 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: 52, // 26pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
  });
}

function createSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 360 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: 28, // 14pt
        color: COLOR_SECONDARY,
        italics: true,
      }),
    ],
  });
}

function createH1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: 32, // 16pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
  });
}

function createH2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: 26, // 13pt
        bold: true,
        color: COLOR_SECONDARY,
      }),
    ],
  });
}

function createH3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: 24, // 12pt
        bold: true,
        color: COLOR_TERTIARY,
      }),
    ],
  });
}

function createP(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { line: 360, before: 60, after: options.after !== undefined ? options.after : 120 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || COLOR_DARK,
      }),
    ],
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ' ', font: FONT_BODY, size: 24, bold: true, color: COLOR_DARK }));
  }
  children.push(new TextRun({ text, font: FONT_BODY, size: 24, color: COLOR_DARK }));

  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, before: 40, after: 80 },
    children,
  });
}

function createCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 200 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: 21, // 10.5pt
        italics: true,
        bold: true,
        color: COLOR_MUTED,
      }),
    ],
  });
}

function createImageParagraph(imagePath, width = 520, height = 340) {
  if (!fs.existsSync(imagePath)) {
    return createP(`[Image file not found: ${imagePath}]`, { alignment: AlignmentType.CENTER, italics: true });
  }
  const imgBuffer = fs.readFileSync(imagePath);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 180, after: 80 },
    children: [
      new ImageRun({
        data: imgBuffer,
        transformation: { width, height },
      }),
    ],
  });
}

function createHeader(sectionTitle) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `Smart University Management System (SUMS)    |    ${sectionTitle}`,
            font: FONT_BODY,
            size: 18,
            italics: true,
            color: COLOR_MUTED,
          }),
        ],
      }),
    ],
  });
}

function createFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 },
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: FONT_BODY,
            size: 20,
            color: COLOR_DARK,
          }),
        ],
      }),
    ],
  });
}

const tableBorderStyle = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: COLOR_BORDER,
};

const tableBorders = {
  top: tableBorderStyle,
  bottom: tableBorderStyle,
  left: tableBorderStyle,
  right: tableBorderStyle,
  insideHorizontal: tableBorderStyle,
  insideVertical: tableBorderStyle,
};

function createStyledTable(headers, rows, colWidths) {
  const tableRows = [];
  const safeColWidths = headers.map((_, i) => (colWidths && colWidths[i]) ? colWidths[i] : 2000);

  // Header row
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) =>
        new TableCell({
          width: { size: safeColWidths[i], type: WidthType.DXA },
          shading: { fill: COLOR_BG_HEADER, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: h,
                  font: FONT_BODY,
                  size: 22,
                  bold: true,
                  color: COLOR_PRIMARY,
                }),
              ],
            }),
          ],
        })
      ),
    })
  );

  // Data rows
  rows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 1;
    tableRows.push(
      new TableRow({
        children: row.map((cellText, i) =>
          new TableCell({
            width: { size: safeColWidths[i] || 2000, type: WidthType.DXA },
            shading: isEven ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: cellText,
                    font: FONT_BODY,
                    size: 21,
                    color: COLOR_DARK,
                  }),
                ],
              }),
            ],
          })
        ),
      })
    );
  });

  return new Table({
    width: { size: safeColWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    borders: tableBorders,
    alignment: AlignmentType.CENTER,
    rows: tableRows,
  });
}

console.log('Helpers defined successfully.');
module.exports = {
  createTitle,
  createSubtitle,
  createH1,
  createH2,
  createH3,
  createP,
  createBullet,
  createCaption,
  createImageParagraph,
  createHeader,
  createFooter,
  createStyledTable,
  FONT_BODY,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_TERTIARY,
  COLOR_DARK
};
