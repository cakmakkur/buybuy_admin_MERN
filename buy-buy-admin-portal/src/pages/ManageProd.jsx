import { useEffect, useRef, useState } from "react";
import img_icon from "../assets/img_icon.svg";
import edit_icon from "../assets/edit_icon.svg";
import trashbin from "../assets/trashbin.svg";
import Thead from "../components/Thead";
import Searchbar from "../components/Searchbar";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ManageProd() {
  const [isLoading, setIsLoading] = useState(true);
  const [prodList, setProdList] = useState([]);
  const [filteredProdList, setFilteredProdList] = useState([]);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [fetchedImgUrls, setFetchedImgUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [srcUrls, setSrcUrls] = useState([]);
  const [editImgId, setEditImgId] = useState(null);
  const [imgToRemove, setImgToRemove] = useState(null);

  const [nn, setNn] = useState("");
  const [isNnEdited, setIsNnEdited] = useState(false);
  const [nc, setNc] = useState("");
  const [isNcEdited, setIsNcEdited] = useState(false);
  const [nd, setNd] = useState("");
  const [isNdEdited, setIsNdEdited] = useState(false);
  const [nb, setNb] = useState("");
  const [isNbEdited, setIsNbEdited] = useState(false);
  const [nCo, setNCo] = useState("");
  const [isNCoEdited, setIsNCoEdited] = useState(false);
  const [np, setNp] = useState(null);
  const [npp, setNpp] = useState(null);
  const [ns, setNs] = useState(null);
  const [nIs, setNIs] = useState(null);
  const [query, setQuery] = useState("");

  const focusRef = useRef(null);

  const toastConfigs = {
    duration: 4000,
    position: "top-right",
  };

  const fetchProductList = async () => {
    await fetch(`${BASE_URL}/admin/manage_prods`)
      .then((response) => response.json())
      .then((data) => {
        setProdList(data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  //FILTER SECTION
  useEffect(() => {
    let updatedFilteredProdList = [...prodList];
    if (query) {
      updatedFilteredProdList = updatedFilteredProdList.filter(
        (p) => p.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    setFilteredProdList(updatedFilteredProdList);
  }, [prodList, query]);
  //-----------------

  //   EDIT MODE

  function resetInputStates() {
    setNn("");
    setNc("");
    setNd("");
    setNb("");
    setNCo("");
    setNp(null);
    setNpp(null);
    setNs(null);
    setNIs(null);
  }
  function resetUtilStates() {
    setImages([]);
    setSrcUrls([]);
    setEditModeIndex(null);
    setEditImgId(null);
    setImgToRemove(null);
  }
  function resetTempEditStates() {
    setIsNnEdited(false);
    setIsNcEdited(false);
    setIsNdEdited(false);
    setIsNbEdited(false);
    setIsNCoEdited(false);
  }

  useEffect(() => {
    setFetchedImgUrls([]);
    resetInputStates();
    resetTempEditStates();
  }, [editModeIndex]);

  useEffect(() => {
    if (editModeIndex === null) {
      focusRef.current = null;
    } else {
      focusRef.current.focus();
    }
  }, [editModeIndex]);

  //STYLE OBJECTS
  const edit_img_div_style = {
    transform: editImgId === null ? "translateX(45vw)" : "translateX(0vw)",
  };
  const upd_btn_style = {
    bottom: editModeIndex === null ? "-10vh" : "0",
  };
  const ccl_btn_style = {
    top: editModeIndex === null ? "-7vw" : "3vw",
    right: editModeIndex === null ? "-7vw" : "3vw",
  };
  //----------------

  const handleAddImage = (event) => {
    const files = Array.from(event.target.files);
    const newSrcUrls = files.map((file) => URL.createObjectURL(file));
    setSrcUrls((prevSrcUrls) => [...prevSrcUrls, ...newSrcUrls]);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleEditImages = () => {
    setEditImgId(prodList[editModeIndex].id);
  };

  const cancelUpdateImages = () => {
    const urls = [...fetchedImgUrls];
    setImages(urls);
    setSrcUrls(urls);
    setEditImgId(null);
  };

  const updateImages = async () => {
    const newlyAddedImages = images.filter(
      (img) => !fetchedImgUrls.includes(img)
    );
    const newlyDeletedImages = fetchedImgUrls.filter(
      (img) => !images.includes(img)
    );

    const deletedImgIndexes = fetchedImgUrls.reduce((acc, url, i) => {
      if (!images.includes(url)) {
        acc.push(i);
      }
      return acc;
    }, []);

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const productId = prodList[editModeIndex].id;

    let hasAlreadyToasted = false;
    if (newlyAddedImages.length) {
      await fetch(`${BASE_URL}/admin/manage_prods/addImg/${productId}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          hasAlreadyToasted = true;
          toast.success("Images updated successfully", toastConfigs);
        })
        .catch((error) => {
          console.log("Error:", error);
          hasAlreadyToasted = true;
          toast.error("Uploading images failed", toastConfigs);
        });
    }
    if (newlyDeletedImages.length) {
      await fetch(
        `${BASE_URL}/admin/manage_prods/deleteImgPaths/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deletedImgIndexes),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (!hasAlreadyToasted)
            toast.success("Product images updated successfully", toastConfigs);
        })
        .catch((error) => {
          console.log("Error:", error);
          if (!hasAlreadyToasted) {
            toast.error("Updating product images failed", toastConfigs);
          }
        });
    }
    setEditModeIndex(null);
    setEditImgId(null);
  };

  const handleMouseOver = (i) => {
    setImgToRemove(i);
  };
  const handleMouseLeave = () => {
    setImgToRemove(null);
  };
  const handleRemoveClick = (i) => {
    let newImages = [...images];
    newImages.splice(i, 1);
    setImages(newImages);

    let newSrcUrls = [...srcUrls];
    newSrcUrls.splice(i, 1);
    setSrcUrls(newSrcUrls);
  };

  useEffect(() => {
    //fetch instead from the public folder
    if (editImgId) {
      const imgPaths = prodList[editModeIndex].img_path;
      const fetchPromises = imgPaths.map(async (path) => {
        return await fetch(`${BASE_URL}/product_imgs/${path}`)
          .then((data) => data.blob())
          .then((blob) => URL.createObjectURL(blob));
      });
      Promise.all(fetchPromises)
        .then((urls) => {
          setImages(urls);
          setFetchedImgUrls(urls);
          setSrcUrls(urls);
        })
        .catch((error) => console.error("Failed to load images", error));
    }
  }, [editImgId]);

  const priceEuro = (cents) => {
    // if (typeof cents !== "number") {
    //   return "hello";
    // }
    return (cents / 100).toFixed(2);
  };

  const handleCancelUpdate = () => {
    resetUtilStates();
  };

  const handleUpdate = async () => {
    if (prodList) {
      const originalProduct = prodList[editModeIndex];

      let editProd = {
        id: originalProduct.id,
        name:
          nn !== "" && nn !== originalProduct.name ? nn : originalProduct.name,
        category:
          nc !== "" && nc !== originalProduct.category
            ? nc
            : originalProduct.category,
        tn_description:
          nd !== "" && nd !== originalProduct.tn_description
            ? nd
            : originalProduct.tn_description,
        brand:
          nb !== "" && nb !== originalProduct.brand
            ? nb
            : originalProduct.brand,
        color:
          nCo !== "" && nCo !== originalProduct.color
            ? nCo
            : originalProduct.color,
        priceCents:
          np !== null && np !== originalProduct.priceCents
            ? np
            : originalProduct.priceCents,
        prevPriceCents:
          npp !== null && npp !== originalProduct.prevPriceCents
            ? npp
            : originalProduct.prevPriceCents,
        shippingCostCents:
          ns !== null && ns !== originalProduct.shippingCostCents
            ? ns
            : originalProduct.shippingCostCents,
        inStock:
          nIs !== null && nIs !== originalProduct.inStock
            ? nIs
            : originalProduct.inStock,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editProd),
      };

      await fetch(
        `${BASE_URL}/admin/manage_prods/${originalProduct.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((message) => {
          console.log(message);
          toast.success("Product data updated successfully", toastConfigs);
          setEditModeIndex(null);
          resetInputStates();
        })
        .then(() => fetchProductList())
        .catch((error) => {
          console.log(error);
          toast.error("Updating product data failed");
        });
      await updateImages();
      resetUtilStates();
      resetTempEditStates();
      resetInputStates();
      fetchProductList();
    }
  };

  const handleDeleteProduct = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(
      `${BASE_URL}/admin/manage_prods/deleteProduct/${editModeIndex}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success("Product has been deleted successfully", toastConfigs);
        setEditModeIndex(null);
        resetInputStates();
        fetchProductList();
      })
      .catch((error) => {
        console.log("Error:", error);
        toast.error("Deleting the product failed", toastConfigs);
      });
  };

  if (!isLoading) {
    return (
      <div className="manage_prod_div">
        <div className="srcbr_s">
          <div></div>
          <Searchbar query={query} setQuery={setQuery} />
          <span className="ize_kr">
            <i>
              Total products:
              <span className="ize_krt">{prodList.length}</span>
            </i>
          </span>
        </div>
        <table>
          <Thead />
          <tbody>
            {filteredProdList.map((p, index) => (
              <tr
                onClick={() => setEditModeIndex(index)}
                className="prod_tr"
                key={p.id}
              >
                {editModeIndex === index ? (
                  <>
                    <td>
                      <input
                        value={nn === "" && !isNnEdited ? p.name : nn}
                        onChange={(e) => {
                          setNn(e.target.value);
                          setIsNnEdited(true);
                        }}
                        type="text"
                        ref={focusRef}
                      />
                    </td>
                    <td>
                      <input
                        value={nc === "" && !isNcEdited ? p.category : nc}
                        onChange={(e) => {
                          setNc(e.target.value);
                          setIsNcEdited(true);
                        }}
                        type="text"
                        className="gnr_tp1"
                      />
                    </td>
                    <td>
                      <textarea
                        value={nd === "" && !isNdEdited ? p.tn_description : nd}
                        onChange={(e) => {
                          setNd(e.target.value);
                          setIsNdEdited(true);
                        }}
                        type="text"
                        className="gnr_tp2"
                      />
                    </td>
                    <td>
                      <input
                        value={nb === "" && !isNbEdited ? p.brand : nb}
                        onChange={(e) => {
                          setNb(e.target.value);
                          setIsNbEdited(true);
                        }}
                        type="text"
                        className="gnr_tp3"
                      />
                    </td>
                    <td>
                      <input
                        value={nCo === "" && !isNCoEdited ? p.color : nCo}
                        onChange={(e) => {
                          setNCo(e.target.value);
                          setIsNCoEdited(true);
                        }}
                        type="text"
                        className="gnr_tp1"
                      />
                    </td>
                    <td>
                      <input
                        value={np === null ? p.priceCents : np}
                        onChange={(e) => setNp(e.target.value)}
                        type="number"
                        className="gnr_tp1"
                      />
                    </td>
                    <td>
                      <input
                        value={npp === null ? p.prevPriceCents : npp}
                        onChange={(e) => setNpp(e.target.value)}
                        type="number"
                        className="gnr_tp1"
                      />
                    </td>
                    <td>
                      <input
                        value={ns === null ? p.shippingCostCents : ns}
                        onChange={(e) => setNs(e.target.value)}
                        type="number"
                        className="gnr_tp1"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) => setNIs(e.target.checked)}
                        checked={nIs === null ? p.inStock : nIs}
                      />
                    </td>
                    <td className="gre_sd">
                      <div>
                        <img
                          onClick={() => handleEditImages()}
                          src={edit_icon}
                          alt=""
                        />
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.tn_description}</td>
                    <td>{p.brand}</td>
                    <td>{p.color}</td>
                    <td>{priceEuro(p.priceCents)}</td>
                    <td>{priceEuro(p.prevPriceCents)}</td>
                    <td>{priceEuro(p.shippingCostCents)}</td>
                    <td>{p.inStock ? "✅" : "❌"}</td>
                    <td className="gre_sd">
                      <div>
                        <img src={img_icon} alt="" />
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          style={upd_btn_style}
          onClick={handleUpdate}
          className="update_prod_btn"
        >
          Update the product
        </button>
        <button
          style={upd_btn_style}
          onClick={handleDeleteProduct}
          className="delete_prod_btn"
        >
          <img src={trashbin} alt="" />
        </button>
        <button
          onClick={handleCancelUpdate}
          style={ccl_btn_style}
          className="cancel_update_btn"
        >
          X
        </button>
        {editImgId === null ? "" : <div className="modal_ksr"></div>}
        <div style={edit_img_div_style} className="img_edt_div">
          {srcUrls.map((url, i) => (
            <div key={url} className="manage_img_container">
              <img
                onMouseOver={() => handleMouseOver(i)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleRemoveClick(i)}
                className="manage_img"
                key={url}
                src={url}
                alt="product image"
              ></img>
              <button
                className={`manage_img_del_btn ${
                  imgToRemove === i ? "manage_img_del_btn_act" : ""
                }`}
              >
                X
              </button>
            </div>
          ))}
          <h4 className="manage_h4_add_img">Add a new image:</h4>
          <input
            onChange={handleAddImage}
            className="manage_img_input"
            type="file"
          />
          <button onClick={() => setEditImgId(null)} className="manage_add_btn">
            Save
          </button>
          <button onClick={cancelUpdateImages} className="manage_cancel_btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
