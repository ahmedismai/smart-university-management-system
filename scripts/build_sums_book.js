const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  SectionType,
  NumberFormat,
} = require('docx');

const {
  createHeader,
  createFooter,
} = require('./book_helpers');

const {
  getTitlePageSection,
  getAbstractSection,
  getAcknowledgementsSection,
  getDeclarationSection,
  getAbbreviationsSection,
  getTableOfContentsSection,
  getListOfTablesSection,
  getListOfFiguresSection
} = require('./content_frontmatter');

const { getChapter1Content } = require('./content_ch1');
const { getChapter2Content } = require('./content_ch2');
const { getChapter3Content } = require('./content_ch3');
const { getChapter4Content } = require('./content_ch4');
const { getChapter5Content, getReferencesSection } = require('./content_ch5');

async function generateGraduationBook() {
  console.log('Generating Smart University Management System (SUMS) Graduation Project Book...');

  const standardMargins = { top: 1440, bottom: 1440, left: 1800, right: 1440 };

  const sections = [
    // 1. Title Page (No header/footer)
    getTitlePageSection(),

    // 2. Abstract (Roman numerals)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          margin: standardMargins,
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN }
        }
      },
      headers: { default: createHeader('Abstract') },
      footers: { default: createFooter() },
      children: getAbstractSection(),
    },

    // 3. Acknowledgements
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Acknowledgements') },
      footers: { default: createFooter() },
      children: getAcknowledgementsSection(),
    },

    // 4. Declaration
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Declaration') },
      footers: { default: createFooter() },
      children: getDeclarationSection(),
    },

    // 5. Abbreviations
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Abbreviations') },
      footers: { default: createFooter() },
      children: getAbbreviationsSection(),
    },

    // 6. Table of Contents
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Table of Contents') },
      footers: { default: createFooter() },
      children: getTableOfContentsSection(),
    },

    // 7. List of Tables & Figures
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('List of Tables & Figures') },
      footers: { default: createFooter() },
      children: [
        ...getListOfTablesSection(),
        ...getListOfFiguresSection(),
      ],
    },

    // 8. Chapter 1: General Introduction (Decimal numbering starts at 1)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          margin: standardMargins,
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
        }
      },
      headers: { default: createHeader('Chapter 1: General Introduction') },
      footers: { default: createFooter() },
      children: getChapter1Content(),
    },

    // 9. Chapter 2: Literature Review
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Chapter 2: Literature Review') },
      footers: { default: createFooter() },
      children: getChapter2Content(),
    },

    // 10. Chapter 3: System Analysis and Design
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Chapter 3: System Analysis and Design') },
      footers: { default: createFooter() },
      children: getChapter3Content(),
    },

    // 11. Chapter 4: System Implementation & User Interfaces
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Chapter 4: System Implementation') },
      footers: { default: createFooter() },
      children: getChapter4Content(),
    },

    // 12. Chapter 5: Conclusion and Future Work
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('Chapter 5: Conclusion and Future Work') },
      footers: { default: createFooter() },
      children: getChapter5Content(),
    },

    // 13. References
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: standardMargins }
      },
      headers: { default: createHeader('References') },
      footers: { default: createFooter() },
      children: getReferencesSection(),
    },
  ];

  const doc = new Document({
    sections,
  });

  const outputPath = path.join(__dirname, '../SUMS_Graduation_Project_Book.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`Successfully generated graduation project book: ${outputPath}`);
  console.log(`File size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB`);
}

generateGraduationBook().catch(err => {
  console.error('Error generating graduation book:', err);
  process.exit(1);
});
