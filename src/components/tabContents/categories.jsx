import React from "react";
import { ReactComponent as CategoryIcon } from "../../assets/categories.svg";

function Categories() {
  const categories = [
    {
      id: 1,
      name: "Category One",
      image:
        "https://abdul-rehman729.github.io/hosted-files/category-dummy-1.jpg",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      name: "Category Two",
      image:
        "https://abdul-rehman729.github.io/hosted-files/category-dummy-1.jpg",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 3,
      name: "Category Three",
      image:
        "https://abdul-rehman729.github.io/hosted-files/category-dummy-1.jpg",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 4,
      name: "Category Four",
      image:
        "https://abdul-rehman729.github.io/hosted-files/category-dummy-1.jpg",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 5,
      name: "Category Five",
      image:
        "https://abdul-rehman729.github.io/hosted-files/category-dummy-1.jpg",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 6,
      name: "Category Six",
      image:
        "https://abdul-rehman729.github.io/hosted-files/category-dummy-1.jpg",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];
  return (
    <div className="tab-content categories">
      <div className="tab-inner">
        <div className="top-header">
          <div className="heading">
            <CategoryIcon />
            <h1>Categories</h1>
          </div>
        </div>

        <div className="category-cards">
          {categories.map((category, index) => {
            return (
              <div className="card">
                <div className="image">
                  <img src={category.image} alt={category.name} />
                </div>

                <div className="text">
                  <h4>{category.name}</h4>
                  <p>{category.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Categories;
