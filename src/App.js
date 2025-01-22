import './App.css';
import CoinKey from "coinkey";
import { useEffect, useState } from 'react';
import { defaultBinary, result } from './helpers/defaultValues';
import { binaryToHex, randomBinaryArray } from './helpers/functions';
import { puzzles } from './helpers/puzzles';

function App() {

  const keys = [...Array(256).keys()];
  const [bits] = useState(keys);
  const [binary, setBinary] = useState(defaultBinary);
  const [puzzle, setPuzzle] = useState(67);
  const [targetAddress, setTargetAddress] = useState("");
  const [hexKey, setHexKey] = useState("");
  const [info, setInfo] = useState(result);
  const [found, setFound] = useState(false);
  const [foundKeys, setFoundKeys] = useState([]);

  function random() {
    setBinary(randomBinaryArray(puzzle));
  }

  function clearTable() {
    if (puzzle == 0) {
      setBinary(defaultBinary);
    } else {
      const loadedBinary = defaultBinary.slice();
      loadedBinary[256 - puzzle] = 1;
      setBinary(loadedBinary);
    }
  }

  function getInfoFromHex() {
    try {
      var ck = new CoinKey(new Buffer(hexKey, "hex"));
      const addressCompressed = ck.publicAddress;
      const pkCompressed = ck.privateWif;
      ck.compressed = false;
      const address = ck.publicAddress;
      const pk = ck.privateWif;
      if (addressCompressed == targetAddress) {
        const oldFoundKeys = foundKeys;
        const name  = `${pk} (Puzzle ${puzzle}/WIF)`;

        if (!oldFoundKeys.includes(name)) {
          // key found
          oldFoundKeys.push(name);
          console.info(name);
          setFoundKeys(oldFoundKeys);
        }

        setFound(true);
      } else {
        setFound(false);
      }

      setInfo({
        address: address,
        addressCompressed: addressCompressed,
        pk: pk,
        pkCompressed: pkCompressed,
      });
    } catch (ex) {
      console.error(ex)
    }
  }

  function select(no) {
    const activeValue = binary[no];
    const old = binary.slice();
    old[no] = activeValue == 0 ? 1 : 0;
    setBinary(old);
  }

  useEffect(() => {
    if (puzzle != 0) {
      const target = puzzles.filter((p) => p.puzzle == puzzle)[0].target;
      setTargetAddress(target);
    } else {
      setTargetAddress("");
    }
    random();
  }, [puzzle]);

  useEffect(() => {
    const hex = binaryToHex(binary.join("")).result;
    setHexKey(hex);
  }, [binary]);

  useEffect(() => {
    if (
      hexKey != "" &&
      hexKey !=
      "0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      getInfoFromHex();
    }
  }, [hexKey]);

  return (
    <div className="App">

      <div className={"puzzleSelect"}>
        <select
          defaultValue={puzzle}
          onChange={(e) => setPuzzle(e.currentTarget.value)}
        >
          <option value={0}>All</option>
          {puzzles.map((p, i) => {
            return (
              <option value={p.puzzle} key={i}>
                Puzzle {p.puzzle}
              </option>
            );
          })}
        </select>
      </div>

      {
        puzzle != 0 ? (<div className={"foundKeys"}>
          <small style={{ marginBottom: 10 }}>Target: {targetAddress}</small>
          {foundKeys.map((f, i) => {
            return (
              <small data-found={true} key={i}>
                <b>{f}</b>
              </small>
            );
          })}
          {foundKeys.length > 0 ? (
            <small
              onClick={() => setFoundKeys([])}
              style={{ marginTop: 10, fontWeight:'bolder', cursor: "pointer" }}
            >
              <u>Clear</u>
            </small>
          ) : null}
        </div>)
          : null
      }



      <div data-found={found} className={"visualButtons"}>
        {bits.map((b, i) => {
          return (
            <button
              key={i}
              disabled={puzzle != 0 && i < 256 - puzzle + 1}
              data-selected={binary[i] == 1 ? true : false}
              data-puzzle-start={puzzle != 0 && i == 256 - puzzle}
              className={i % 16 == 0 ? "first" : null}
              onClick={() => select(i)}
            >
              <span>{256 - i}</span>
            </button>
          );
        })}
      </div>

      <div className={"visualBottomButtons"}>
        <button onClick={() => clearTable()}>
          CLEAR
        </button>
        <button onClick={() => random()}>
          RANDOM
        </button>
      </div>

      <div className="result">
        {
          /*
          <div>
            <span>PK (Binary)</span>
            <span>{binary.join("")}</span>
          </div>
          */
        }
        <div>
          <span>PK (HEX)</span>
          <span>{hexKey}</span>
        </div>
        <div>
          <span>
            ADDRESS (C)
          </span>
          <span>{info.addressCompressed}</span>
        </div>
        <div>
          <span>
            ADDRESS (U)
          </span>
          <span>{info.address}</span>
        </div>
        <div>
          <span>
            WIF-KEY (C)
          </span>
          <span>{info.pkCompressed}</span>
        </div>
        <div>
          <span>
            WIF-KEY (U)
          </span>
          <span>{info.pk}</span>
        </div>
      </div>

      <div className="footer">
        <a href="https://btcpuzzle.info/tools/visual-puzzle-hunter">
          <small>Powered by btcpuzzle.info</small>
        </a>
      </div>

    </div>
  );
}

export default App;
