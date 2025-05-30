import { useState, useEffect, Fragment } from "react";

const Index = () => {
  const [listData, setListData] = useState([]);
  const [inputString, setInputString] = useState("");
  const [sortedList, setSortedList] = useState();
  const textAreaPlaceholder =
    "Input or Copy/paste your list here\nYour data should be in the following format, ending with a semi-colon:\nStock Size, Piece Mark, Length;\n4x1/4 Flat, P0002, 14400;";
  const tempInputValue =
    "4x1/4 Flat, P0001, 3205;\n4x1/4 Flat, P0002, 1456;\n4x1/4 Flat, P0003, 6132;\n4x1/4 Flat, P0004, 4821;\n4x1/4 Flat, P0005, 2324;\n4x1/4 Flat, P0006, 5179;\n4x1/4 Flat, P0007, 2833;\n4x1/4 Flat, P0008, 3642;\n4x1/4 Flat, P0009, 5069;\n4x1/4 Flat, P0010, 4378;\n4x1/4 Flat, P0011, 6485;\n4x1/4 Flat, P0012, 267;\n4x1/4 Flat, P0013, 1390;\n4x1/4 Flat, P0014, 4653;\n4x1/4 Flat, P0015, 1776;\n4x1/4 Flat, P0016, 4732;\n3x1/4 Flat, P0017, 6479;\n3x1/4 Flat, P0018, 609;\n3x1/4 Flat, P0019, 1924;\n3x1/4 Flat, P0020, 5052;\n";

  // data shape to create from text

  useEffect(() => {
    if (inputString.includes(";")) {
      handleInput(inputString);
    }
  }, [inputString]);

  const handleInput = (inputString) => {
    // converts data into an array of objects
    // one array object per line and filter out empty lines
    const items = {
      stockSizes: {},
      used: 0,
      waste: 0,
    };

    const arrStr = inputString.split("\n").filter((el) => el !== "");
    const arr = arrStr.map((el) => parseLine(el));

    //  parse data first, sort the data into a new container how you need it, put into state

    // loop over arr
    // sorts into arrays by stock size
    for (let i = 0; i < arr.length; i++) {
      // if items object has stock name, add to array, else create new property and add
      if (arr[i].stock in items.stockSizes) {
        items.stockSizes[arr[i].stock].unsorted.push(arr[i]);
      } else {
        items.stockSizes[arr[i].stock] = {
          stockSizeName: arr[i].stock,
          unsorted: [arr[i]],
          sortedDsc: [],
          lengths: [],
          overLength: [],
          standardLength: 6096,
          numberOfLengths: 0,
          used: 0,
          waste: 0,
        };
      }
    }

    // sort and filter stockSize items descending order and good or overlength
    for (const stockSize in items.stockSizes) {
      const stock = items.stockSizes[stockSize];
      const sorted = stock.unsorted.sort((a, b) => b.length - a.length);
      stock.sortedDsc = sorted.filter(
        (el) => el.length <= stock.standardLength
      );
      stock.overLength = sorted.filter(
        (el) => el.length > stock.standardLength
      );
    }

    // parse sorted/filtered stockSize items and place into length groups

    class length {
      constructor(id, stockSize, stdLength) {
        this.id = id;
        this.stockSize = stockSize;
        this.lengthMark = `${stockSize}-${id}`;
        this.stdLength = stdLength;
        this.parts = [];
        this.lengthUsed = 0;
        this.lengthWaste = stdLength; // reduces as stockItems are added
      }
    }

    // loop over stock sizes
    for (const stockSize in items.stockSizes) {
      const stock = items.stockSizes[stockSize];
      const stockItems = stock.sortedDsc;
      const lengths = stock.lengths;

      let lengthCount = 1; // length id / lengthMark suffix

      while (stockItems.length > 0) {
        //create a new length object
        const len = new length(
          lengthCount.toString().padStart(3, "0"),
          stock.stockSizeName,
          stock.standardLength
        );

        lengthCount++; // increments id number

        // add largest stock length available for the current lengthWaste 'space'
        // add part length to lengthUsed
        // subtract part length to lengthWaste
        // add to length parts array and remove from stockItems array
        for (let i = 0; i < stockItems.length; i++) {
          if (stockItems[i].length <= len.lengthWaste) {
            len.lengthUsed += stockItems[i].length;
            len.lengthWaste -= stockItems[i].length;
            len.parts.push(stockItems.splice(i, 1)[0]);
            i = 0; // restarts loop to search again
          }
        }
        //push len object to lengths array in stock object
        lengths.push(len);
      }
      setSortedList(items);
    }
  };

  const sortIntoLenghts = (list, stdLength) => {
    // the idea is to sort this list into smaller lists,
    // where the last number (the length) of each object when added up,
    // is closest to the standard 'stock lengths' that the material comes in
    // most material stock lengths are 20'-0" / 240" / 6096mm long
    // take in a list of objects
    // sort objects decending by length property. this value should always be metric in mm
    // checks to see if any of the lengths require are longer than the stock length
    // if some longer lengths are present, they should be moved to the 'over size' group
    // create a new stock length object, that represents an entire stock length of material
    // listObject
    // {
    //   stockSizes: [stockSizeObjects],
    //   used: total length used
    //   waste: length left over,
    // }
    // stockSizeObject
    // {
    //   name: string, (name of stock size i.e. "3x1/4")
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
    // setSortedList(
    //   {
    //     stockSizes: [
    //       {
    //         name: '4x1/4',
    //         lengths: [
    //           {
    //             stockSize: '4x1/4',
    //             lengthObjectId: 1,
    //             parts: [
    //               {
    //                 stock: '4x1/4',
    //                 mark: '0001',
    //                 length: 2234,
    //                },
    //                {
    //                 stock: '4x1/4',
    //                 mark: '0002',
    //                 length: 1234,
    //                },
    //                {
    //                 stock: '4x1/4',
    //                 mark: '0003',
    //                 length: 1011,
    //                },
    //                {
    //                 stock: '4x1/4',
    //                 mark: '0004',
    //                 length: 245,
    //                },
    //             ],
    //             used: 0,
    //             waste: 0,
    //           }
    //         ],
    //         standardLength: 6096,
    //         used: 0,
    //         waste: 0,
    //       }
    //     ],
    //     used: 0,
    //     waste: 0,
    //   }
    // );
  };

  const parseLine = (str) => {
    //input should be in "Stock Size, Piece Mark, Length" => "4x1/4 Flat, P0002, 14400" format
    let arr = str.slice(0, str.indexOf(";")).trim().split(", ");

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
      stock: arr[0]?.trim().split(" ").join("_"), // convert spaces to underscore
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

    //split string into feet and inches array
    const feetInches = str.trim().split("'-");

    // add feet converted to inches, to totalInches
    totalInches += Number(Number(feetInches[0]) * numberOfInchesInOneFoot);

    //inches
    const inchesArr = feetInches[1].split(" ");

    //add inches to totalInches
    totalInches += Number(inchesArr[0]);

    //if fraction, convert to inches and add to totalInches
    if (inchesArr.length > 1) {
      const fraction = inchesArr[1].split("/");
      // convert to decimal and add to totalInches
      totalInches += Number(fraction[0]) / Number(fraction[1]);
    }

    const mm = Math.round(totalInches * numberOfMmInOneInch);
    return mm;
  };

  return (
    <div className="p-10 w-full flex justify-center">
      <div className="max-w-3xl">
        <div className="text-base text-slate-800 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Cut List</h1>
          <h2 className="text-2xl font-semibold">Linear Nesting App</h2>
          <p>
            This app takes in an unsorted list of pieces of a specific length
            and creates a linear cutting list based on an input length of
            standard stock and then sorts the list.
          </p>
          <h3 className="text-xl font-semibold">Feature Set Checklist</h3>
          <ul className="ml-4  flex flex-col gap-2">
            <li className="line-through">
              Let's start off with a simple input and sort system and expand
              from there.
            </li>
            <li className="line-through">
              Parse the data, sort into lists of the same kind based on the
              stock section size (e.g. 4x1/4).
            </li>
            <li className="">
              Add ability to change the stock lengths for each size of material
            </li>
            <li className="">Update UI / Styling</li>
            <li className="">
              Basic text printable/exportable style e.g. print to pdf, email,
              etc
            </li>
            <li className="">Bar graph representation of length usage</li>
            <li className="">Inches only input (e.g. 125.25")</li>
            <li className="">
              Investigate process using cutoffs/waste from previous pieces first
              before using new length
            </li>
            <li className=""></li>
            <li className=""></li>
            <li className=""></li>
          </ul>
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
            value={inputString}
            placeholder={textAreaPlaceholder}
            // defaultValue={tempInputValue}
            onChange={(evt) => setInputString(evt.target.value)}
          ></textarea>
          <button
            onClick={() => setInputString(tempInputValue)}
            className="bg-blue-300 w-fit px-5 py-1 rounded-md mt-3"
          >
            Use Sample Data
          </button>
        </div>

        <h3 className="mt-10 p-0 mb-0 text-xl font-semibold">Output</h3>
        {sortedList &&
          Object.keys(sortedList.stockSizes).map((stockSize, ind) => {
            return (
              // one table per stock size
              <table
                key={"a" + ind}
                className="mt-3 border-separate border-spacing-2 border-2 border-slate-300 w-full text-left bg-slate-600 text-slate-200 rounded-lg table-fixed"
              >
                <thead>
                  <tr className="text-2xl font-bold">
                    <td>{stockSize}</td>
                  </tr>

                  <tr className="bg-slate-500 text-slate-200">
                    <th className="border border-slate-400 p-2 rounded-md">
                      Mark
                    </th>
                    <th className="border border-slate-400 p-2 rounded-md">
                      Length
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {/* length groups */}
                  {sortedList &&
                    sortedList.stockSizes[stockSize].lengths.map(
                      (lengthGroup, ind) => {
                        return (
                          <Fragment key={'b' + ind}>
                            <tr className="text-lg font-semibold">
                              <th>Length {lengthGroup.id}</th>
                            </tr>

                            {/* partObjects */}
                            {lengthGroup?.parts?.map((row, ind) => {
                              return (
                                <tr key={"c" + ind} className="text-slate-300">
                                  <td className="border border-slate-500 p-2 rounded-md">
                                    {row.mark}
                                  </td>
                                  <td className="border border-slate-500 p-2 rounded-md">
                                    {row.length}
                                  </td>
                                </tr>
                              );
                            })}

                            {/* Offcut */}
                            <tr key={ind} className="text-blue-300">
                              <td className="border border-blue-500 p-2 rounded-md">
                                Off-Cut
                              </td>
                              <td className="border border-blue-500 p-2 rounded-md">
                                {lengthGroup.lengthWaste}
                              </td>
                            </tr>
                          </Fragment>
                        );
                      }
                    )}

                  {sortedList.stockSizes[stockSize].overLength.length > 0 && (
                    <tr className="text-red-600 text-xl font-bold">
                      <td className="p-2">Over Length</td>
                    </tr>
                  )}

                  {sortedList.stockSizes[stockSize].overLength.length > 0 &&
                    sortedList.stockSizes[stockSize].overLength.map(
                      (row, ind) => {
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
                      }
                    )}
                </tbody>
              </table>
            );
          })}
      </div>
    </div>
  );
};

export default Index;
