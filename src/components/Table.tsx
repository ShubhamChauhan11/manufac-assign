import { Table } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMemo } from "react";

export function Tables({ ...props }) {
  let data = props.data;
  // function to add Gamma column to the data
  function addGammaColumn(data: any) {
    return data.map((row: any) => {
      row["Gamma"] =
        (parseFloat(row["Ash"]) * parseFloat(row["Hue"])) /
        parseFloat(row["Magnesium"]);
      return row;
    });
    return data;
  }
  let updatedData = useMemo(() => addGammaColumn(data), [data]);
  //function to segregate data based on class

  function classWiseData(data: any) {
    let classWiseData: any = {};
    data.forEach((row: any) => {
      if (!classWiseData[`Class${row["Alcohol"]}`]) {
        classWiseData[`Class${row["Alcohol"]}`] = [];
      }
      classWiseData[`Class${row["Alcohol"]}`].push(row);
    });
    return classWiseData;
  }
  let classWiseDataObj = useMemo(() => classWiseData(data), [data]);
  //calculate mean function
  function meanOfClassWiseData(classWiseDataObj: any, key: string) {
    let meanOfClassWiseData: any = {};
    Object.keys(classWiseDataObj).forEach((eachClass) => {
      let sum = 0;
      classWiseDataObj[eachClass].forEach((row: any) => {
        sum += parseFloat(row[key]);
      });
      let mean = sum / classWiseDataObj[eachClass].length;

      meanOfClassWiseData[eachClass] =
        mean % 1 !== 0 && String(mean).split(".")[1].length > 3
          ? mean.toFixed(3)
          : mean;
    });
    return meanOfClassWiseData;
  }
  //calculate mode function
  function modeOfClassWiseData(classWiseDataObj: any, key: string) {
    let modeOfClassWiseData: any = {};
    Object.keys(classWiseDataObj).forEach((eachClass) => {
      let count: any = {};
      let maxCount = 0;
      let mode: number = 0;
      classWiseDataObj[eachClass].forEach((row: any) => {
        if (!count[row[key]]) {
          count[row[key]] = 1;
        } else {
          count[row[key]]++;
        }
        if (count[row[key]] > maxCount) {
          maxCount = count[row[key]];
          mode = row[key];
        }
      });

      //if digits are more than 3 then round it to 3 decimal places

      modeOfClassWiseData[eachClass] =
        mode % 1 !== 0 && String(mode).split(".")[1].length > 3
          ? mode.toFixed(3)
          : mode;
    });
    return modeOfClassWiseData;
  }
  //calculate median function

  function medianOfClassWiseData(classWiseDataObj: any, key: string) {
    let medianOfClassWiseData: any = {};
    Object.keys(classWiseDataObj).forEach((eachClass) => {
      let values = classWiseDataObj[eachClass].map((row: any) =>
        parseFloat(row[key])
      );
      values.sort((a: number, b: number) => a - b);
      let median;
      if (values.length % 2 === 0) {
        median =
          (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
      } else {
        median = values[(values.length - 1) / 2];
      }
      medianOfClassWiseData[eachClass] =
        median % 1 !== 0 && String(median).split(".")[1].length > 3
          ? median.toFixed(3)
          : median;
    });
    return medianOfClassWiseData;
  }
  //  function to construct tabular structure combining mean, mode and median data of each class

  function constructTableData(key: string, data: any) {
    let measures = [`${key} mean`, `${key} mode`, `${key} median`];
    let meanData = meanOfClassWiseData(data, key);
    let modeData = modeOfClassWiseData(data, key);
    let medianData = medianOfClassWiseData(data, key);
    let categories = Object.keys(meanData);
    let tableData: any = [];
    measures.forEach((measure) => {
      let row: any = { Measure: measure };
      categories.forEach((category) => {
        if (measure.includes("mean")) {
          row[category] = meanData[category];
        } else if (measure.includes("mode")) {
          row[category] = modeData[category];
        } else {
          row[category] = medianData[category];
        }
      });

      tableData.push(row);
    });
    return tableData;
  }
  let tableDatas = useMemo(() => {
    return [
      constructTableData("Flavanoids", classWiseDataObj),
      constructTableData("Gamma", classWiseDataObj),
    ];
  }, [updatedData]);
  console.log(tableDatas);

  return (
    <div>
      {tableDatas.map((tableData: any, index: number) => {
        const rows = tableData.map((row: any) => {
          return (
            <Table.Tr key={row["Measure"]}>
              <Table.Td key={row["measure"]}>{row["Measure"]}</Table.Td>
              {Object.keys(tableData[0])
                .filter((key) => key !== "Measure")
                .map((each) => {
                  return <Table.Td key={row[each]}>{row[each]}</Table.Td>;
                })}
            </Table.Tr>
          );
        });
        return (
          <div>
            <h3>{`Table ${index + 1}`}</h3>
            <Table.ScrollContainer minWidth={300} key={index}>
              <Table
                withTableBorder
                withColumnBorders
                stickyHeader={true}
                striped
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th key={"Measure"}>{"Measure"}</Table.Th>
                    {Object.keys(tableData[0])
                      .filter((key) => key !== "Measure")
                      .map((each) => {
                        return <Table.Th key={each}>{each}</Table.Th>;
                      })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </div>
        );
      })}
    </div>
  );
}
