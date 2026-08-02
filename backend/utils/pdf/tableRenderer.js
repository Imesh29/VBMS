export const drawTable = async (doc, headers, rows) => {
  await doc.table(
    {
      headers,
      rows,
    },
    {
      prepareHeader: () => {
        doc.font("Helvetica-Bold").fontSize(10);
      },

      prepareRow: () => {
        doc.font("Helvetica").fontSize(9);
      },

      divider: {
        header: {
          disabled: false,
        },
      },
    },
  );
};
