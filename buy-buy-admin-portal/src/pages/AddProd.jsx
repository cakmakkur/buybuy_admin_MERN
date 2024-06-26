import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import logo from "../assets/logo12.png";
import useAxiosPrivate from "../utils/useAxiosPrivate";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AddProd() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("pianos");
  const [tn_description, setTn_Description] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("Black");
  const [priceCents, setPriceCents] = useState(null);
  const [shippingCostCents, setShippingCostCents] = useState(null);
  const [images, setImages] = useState([]);
  const [uplImgSrc, setUplImgSrc] = useState([]);
  const [toRemove, setToRemove] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const uploadFileRef = useRef();

  const toastConfigs = {
    duration: 4000,
    position: "top-right",
  };

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };
  const handleDescription = (event) => {
    setTn_Description(event.target.value);
  };
  const handleBrand = (event) => {
    setBrand(event.target.value);
  };
  const handleColor = (event) => {
    setColor(event.target.value);
  };
  const handlePrice = (event) => {
    setPriceCents(event.target.value);
  };
  const handleShipping = (event) => {
    setShippingCostCents(event.target.value);
  };
  const handleImages = (event) => {
    setImages([...images, ...Array.from(event.target.files)]);
  };

  useEffect(() => {
    let urls = [];
    images.map((img) => {
      urls.push(URL.createObjectURL(img));
    });
    setUplImgSrc(urls);
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("category", category);
    formData.append("tn_description", tn_description);
    formData.append("brand", brand);
    formData.append("color", color);
    formData.append("priceCents", priceCents);
    formData.append("shippingCostCents", shippingCostCents);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axiosPrivate.post(
        `${BASE_URL}/admin/add_prod`,
        formData
      );
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Product successfully added", toastConfigs);
      } else {
        return toast.error("Adding new product failed", toastConfigs);
      }
      setName("");
      setTn_Description("");
      setBrand("");
      setColor("Black");
      setPriceCents(0);
      setShippingCostCents(0);
      setImages([]);
      setUplImgSrc([]);
      uploadFileRef.current.value = "";
    } catch (err) {
      console.log("Error:", err);
      toast.error("Adding new product failed", toastConfigs);
    }
  };

  //----------------
  const handleMouseOver = (i) => {
    setToRemove(i);
  };
  const handleMouseLeave = () => {
    setToRemove(null);
  };
  const handleRemoveClick = (i) => {
    let newImages = [...images];
    newImages.splice(i, 1);
    setImages(newImages);
  };

  return (
    <div className="add_prod_div">
      <div className="bckg_logo_add_div">
        <img src={logo} alt="" />
      </div>
      <form className="new_prod_form" onSubmit={handleSubmit}>
        <h2>Add a new product:</h2>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleName}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            onChange={(e) => handleCategory(e)}
            name="category"
            id="category"
            form="categoryForm"
          >
            <option value="pianos">Pianos</option>
            <option value="guitars">Guitars</option>
            <option value="saxophones">Saxophones</option>
            <option value="violins">Violins</option>
            <option value="drums">Drums</option>
            <option value="contrabass">Contrabasses</option>
          </select>
        </div>
        <div className="desc_div">
          <label className="desc_label" htmlFor="description">
            Short Description:
          </label>
          <textarea
            className="desc_input"
            type="text"
            id="description"
            value={tn_description}
            onChange={handleDescription}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={handleBrand}
            required
          />
        </div>
        <div>
          <label htmlFor="productName">Color:</label>
          <select
            onChange={(e) => handleColor(e)}
            name="color"
            id="color"
            form="colorForm"
          >
            <option value="Black">Black</option>
            <option value="Red">Red</option>
            <option value="White">White</option>
            <option value="Brown">Brown</option>
            <option value="Yellow">Yellow</option>
            <option value="Blue">Blue</option>
            <option value="Green">Brown</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={priceCents}
            onChange={handlePrice}
            placeholder=" in cents..."
            required
          />
        </div>
        <div>
          <label htmlFor="shipping">Shipping Cost:</label>
          <input
            type="number"
            id="shipping"
            placeholder=" in cents..."
            value={shippingCostCents}
            onChange={handleShipping}
            required
          />
        </div>
        <div>
          <label htmlFor="images">Upload Images:</label>
          <input
            ref={uploadFileRef}
            type="file"
            id="images"
            multiple
            onChange={handleImages}
          />
        </div>
        <div>
          <button className="submit-prod-btn" type="submit">
            Add New Product
          </button>
        </div>
      </form>
      <div className="uploaded_imgs">
        <h2 className="upsl_oore">Uploaded Images (max 5):</h2>
        {uplImgSrc.map((url, i) => (
          <div className="tnail_div" key={url}>
            <img
              onMouseOver={() => handleMouseOver(i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRemoveClick(i)}
              className="added_tn"
              src={url}
              alt=""
            />
            <button
              className={`img_del_btn ${
                toRemove === i ? "img_del_btn_active" : ""
              }`}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
