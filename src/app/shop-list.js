import React from "react";
import { PropertyProvider, usePropertyContext } from "./components/property/PropertyContext";
import PropertyFilters from "./components/property/PropertyFilters";
import PropertyPagination from "./components/property/PropertyPagination";
import PropertyCard from "./components/property/PropertyCard";
import ScrollToTop from "./components/ScrollToTop";
import Modal from "./components/Modal";

const App = () => {
    const { filters, setFilters, currentPage, setCurrentPage, modalVisible, setModalVisible } =
        usePropertyContext();

    const properties = [
        // Immo1
        {
            image: "path/to/image.jpg",
            title: "Beautiful Apartment",
            location: "New York, USA",
            details: ["3 Bed", "2 Bath", "1500 sqft"],
            price: "3000",
            agent: { photo: "path/to/agent.jpg", name: "John Doe" },
        },
        // Immo2...
    ];

    const filteredProperties = properties.filter((property) => {
        if (filters.sort === "price") {
            return true;        // TODO: Logique de tri/filtrage
        }
        return true;
    });

    const handleSortChange = (sort) => setFilters((prev) => ({ ...prev, sort }));
    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <PropertyProvider>
            <div>
                <PropertyFilters
                    sortOptions={[{value: "price", label: "Price"}]}
                    itemsPerPageOptions={[{value: 12, label: "12"}]}
                    onSortChange={handleSortChange}
                />
                <div>
                    {filteredProperties.map((property, index) => (
                        <PropertyCard key={index} {...property} />
                    ))}
                </div>
                <PropertyPagination
                    currentPage={currentPage}
                    totalPages={10}
                    onPageChange={handlePageChange}
                />
                <ScrollToTop/>
                <Modal isVisible={modalVisible} onClose={() => setModalVisible(false)}>
                    <h1>Modal Content</h1>
                </Modal>
            </div>
        </PropertyProvider>
    );
};

export default App;
