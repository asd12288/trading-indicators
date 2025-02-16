import React from "react";
import { DataTable } from "./DataTable";
import { signalTableColumns } from "./signalTableColumns";



const SignalsTable = ({ signals }) => {
  return (
    <DataTable type="signals" columns={signalTableColumns} data={signals} />
  );
};

export default SignalsTable;
