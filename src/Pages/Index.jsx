import { useState } from "react";
import { useEffect } from "react";

const Index = () => {
  const [listData, setListData] = useState([]);
  const [stockLengths, setStockLengths] = useState();
  const [sortedList, setSortedList] = useState();
  const textAreaPlaceholder =
    "Input or Copy/paste your list here\nYour data should be in the following format, ending with a semi-colon:\nStock Size, Piece Mark, Length;\n4x1/4 Flat, P0002, 14400;";
  const tempInputValue = "4x1/4 Flat, P0001, 3205;\n4x1/4 Flat, P0002, 1456;\n4x1/4 Flat, P0003, 6132;\n4x1/4 Flat, P0004, 4821;\n4x1/4 Flat, P0005, 2324;\n4x1/4 Flat, P0006, 5179;\n4x1/4 Flat, P0007, 2833;\n4x1/4 Flat, P0008, 3642;\n4x1/4 Flat, P0009, 5069;\n4x1/4 Flat, P0010, 4378;\n4x1/4 Flat, P0011, 6485;\n4x1/4 Flat, P0012, 267;\n4x1/4 Flat, P0013, 1390;\n4x1/4 Flat, P0014, 4653;\n4x1/4 Flat, P0015, 1776;\n4x1/4 Flat, P0016, 4732;\n3x1/4 Flat, P0017, 6479;\n3x1/4 Flat, P0018, 609;\n3x1/4 Flat, P0019, 1924;\n3x1/4 Flat, P0020, 5052;"

  // 4x1/4 Flat, P0001, 2200;
  // 6x3/8 Flat, P0002, 1200;
  // 6x3/8 Flat, P0002, 250;

  // 4x1/4 Flat, P0001, 2200;
  // 6x3/8 Flat, P0002, 1200;
  // 6x3/8 Flat, P0003, 250;
  // 6x3/8 Flat, P0004, 9'-10 3/8";

  // const parsedDataModel = new Map();

  // data shape to create from text

  const handleInput = (inputString) => {
    const items = new Map();
    // converts data into an array of objects
    //one array object per line and filter out empty lines
    const arrStr = inputString.split("\n").filter((el) => el !== "");
    const arr = arrStr.map((el) => parseLine(el));

    //loop over arr
    for (let i = 0; i < arr.length; i++) {
      // if items object has stock name, add to array, else create new property and add
      if (items.has(arr[i].stock)) {
        items.set(arr[i].stock, [...items.get(arr[i].stock), arr[i]]);
      } else {
        items.set(arr[i].stock, [arr[i]]);
      }
    }

    console.log(items)
    setListData(items);
  };

  const sortList = (list, stdLength) => {
    const sorted = list.sort((a, b) => b.length - a.length);
    const overStdLength = sorted.filter((el) => el.length > stdLength)
    let withinStdLength = sorted.filter((el) => el.length <= stdLength);

    // sample data for sorting
    // 4x1/4 Flat, P0001, 3205;
    // 4x1/4 Flat, P0002, 1456;
    // 4x1/4 Flat, P0003, 6132;
    // 4x1/4 Flat, P0004, 4821;
    // 4x1/4 Flat, P0005, 2324;
    // 4x1/4 Flat, P0006, 5179;
    // 4x1/4 Flat, P0007, 2833;
    // 4x1/4 Flat, P0008, 3642;
    // 4x1/4 Flat, P0009, 5069;
    // 4x1/4 Flat, P0010, 4378;
    // 4x1/4 Flat, P0011, 6485;
    // 4x1/4 Flat, P0012, 267;
    // 4x1/4 Flat, P0013, 1390;
    // 4x1/4 Flat, P0014, 4653;
    // 4x1/4 Flat, P0015, 1776;
    // 4x1/4 Flat, P0016, 4732;
    // 4x1/4 Flat, P0017, 6479;
    // 4x1/4 Flat, P0018, 609;
    // 4x1/4 Flat, P0019, 1924;
    // 4x1/4 Flat, P0020, 5052;

    // the idea is to sort this list into smaller lists,
    // where the last number (the length) of each object when added up,
    // is closest to the standard 'stock lengths' that the material comes in
    // most material stock lengths are 20'-0" / 240" / 6096mm long

    // take in a list of objects
    // sort objects decending by length property. this value should always be metric in mm
    // checks to see if any of the lengths require are longer than the stock length
    // if some longer lengths are present, they should be moved to the 'over size' group
    // create a new stock length object, that represents an entire stock length of material
    //

    // listObject
    // {
    //   stockSizes: [stockSizeObjects],
    //   used: total length used
    //   waste: length left over,
    // }

    // stockSizeObject
    // {
    //   lengths: [lengthObjects],
    //   standardLength: number, (standard stock length material comes in)
    //   used: number, (total length used)
    //   waste: number, (total length left over)
    // }

    // length objects
    // {
    //   stockSize: string,
    //   lengthObjectId:,
    //   parts:[partObjects in lengthGroup],
    //   used: total length used
    //   waste: length left over,
    // }

    // partObject (created from string input)
    // {
    //  stock: string,
    //  mark: string,
    //  length: number,
    // }

    // return should be an object
    // next fit algorithim
    // tree algo (heap sort)
    // smallest number first recurses back, left side of tree
    // a v l trees
    // dfs recurrsive tree transversal

    // rectangle packing
    // bin packing problem
    // area opimization

    return {
      withinStdLength: withinStdLength,
      overStdLength: overStdLength,
    };

  };

  const parseLine = (str) => {
    //input should be in "Stock Size, Piece Mark, Length" => "4x1/4 Flat, P0002, 14400" format
    const arr = str.slice(0, str.indexOf(";")).trim().split(", ");

    // check if feet/inches
    let length = arr[2]?.trim();

    // set length value
    if (length?.includes('"') || length?.includes("'")) {
      length = convertFeetInchesToMm(length);
    } else {
      length = Number(length);
    }

    // put data into object
    const obj = {
      stock: arr[0]?.trim(),
      mark: arr[1]?.trim(),
      length: length,
    };

    // check for some errors
    if (
      obj.stock === undefined ||
      obj.mark === undefined ||
      obj.length === undefined
    )
      return "error";

    if (!obj.length > 0) return "error";

    //return obj
    return obj;
  };

  const convertFeetInchesToMm = (inputString) => {
    //convert text into decimal inches
    //convert inches to mm
    const numberOfInchesInOneFoot = 12;
    const numberOfMmInOneInch = 25.4;
    let totalInches = 0;

    //remove " at end of string if present
    const str = inputString.split('"')[0];
    // console.log(str);

    //split string into feet and inches array
    const feetInches = str.trim().split("'-");

    // add feet converted to inches, to totalInches
    totalInches += Number(Number(feetInches[0]) * numberOfInchesInOneFoot);

    //inches
    const inchesArr = feetInches[1].split(" ");
    // console.log(inchesArr);

    //add inches to totalInches
    totalInches += Number(inchesArr[0]);

    //if fraction, convert to inches and add to totalInches
    if (inchesArr.length > 1) {
      const fraction = inchesArr[1].split("/");
      // convert to decimal and add to totalInches
      totalInches += Number(fraction[0]) / Number(fraction[1]);
      // console.log(fraction);
    }

    const mm = Math.round(totalInches * numberOfMmInOneInch);
    return mm;
  };

  return (
    <div className="p-10">
      <div className="text-base text-slate-800">
        <h1 className="text-2xl">Cut List</h1>
        <h2 className="text-xl">Linear Nesting App</h2>
        <p>
          This app takes in an unsorted list of pieces of a specific length and
          creates a linear cutting list based on an input length of standard
          stock and then sorts the list
        </p>
        <p>
          Let's start off with a simple input and sort system and expand from
          there
        </p>
        <p>
          parse the data, sort into lists of the same kind based on the stock
          section size (e.g. 4x1/4)
        </p>
      </div>

      <div className="flex flex-col text-base text-slate-800 mt-10">
        <label htmlFor="input" className="font-semibold">
          Input
        </label>
        <textarea
          name="list"
          id="list"
          cols="50"
          rows="10"
          placeholder={textAreaPlaceholder}
          defaultValue={tempInputValue}
          onChange={(evt) => handleInput(evt.target.value)}
        ></textarea>
      </div>

      {Array.from(listData).map((el, ind) => {
        return (
          <table key={ind} className="mt-10 border-separate border-spacing-2 border-2 border-slate-300 w-full text-left bg-slate-600 text-slate-200 rounded-lg table-fixed">
            <thead>
              <tr className="text-2xl font-bold">
                <td>{el[0]}</td>
              </tr>
              <tr className="bg-slate-500 text-slate-200">
                <th className="border border-slate-400 p-2 rounded-md">Mark</th>
                <th className="border border-slate-400 p-2 rounded-md">
                  Length
                </th>
              </tr>
            </thead>
            <tbody>
              {sortList(el[1], 6096).withinStdLength.map((row, ind) => {
                return (
                  <tr key={ind} className="text-slate-300">
                    <td className="border border-slate-500 p-2 rounded-md">
                      {row.mark}
                    </td>
                    <td className="border border-slate-500 p-2 rounded-md">
                      {row.length}
                    </td>
                  </tr>
                );
              })}

              <tr className="text-red-600 text-xl font-bold">
                <td className="p-2">Over Length</td>
              </tr>

              {sortList(el[1], 6096).overStdLength.map((row, ind) => {
                return (
                  <tr key={ind} className="text-slate-300">
                    <td className="border border-slate-500 p-2 rounded-md">
                      {row.mark}
                    </td>
                    <td className="border border-slate-500 p-2 rounded-md">
                      {row.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

export default Index;
