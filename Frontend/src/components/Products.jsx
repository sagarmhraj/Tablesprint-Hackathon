import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Image, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { TablesprintState } from '../contexts/TablesprintContext';
import { useToast } from "@chakra-ui/react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const isFileSizeValid = (file) => {
  return file && file.size <= MAX_FILE_SIZE;
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = TablesprintState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    product_name: '',
    category_id: '',
    sub_category_id: '',
    image: null
  });
  const [editProductData, setEditProductData] = useState({
    product_name: '',
    category_id: '',
    sub_category_id: '',
    image: null,
    status: ''
  });
  const [deleteProductId, setDeleteProductId] = useState(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get('http://localhost:5000/api/v1/product/', config);
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get('http://localhost:5000/api/v1/category/', config);
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get('http://localhost:5000/api/v1/subcategory/', config);
      setSubcategories(response.data.data);
    } catch (err) {
      console.error('Failed to fetch subcategories', err);
    }
  };

  const handleFileChange = (e, setFunction) => {
    const file = e.target.files[0];
    if (isFileSizeValid(file)) {
      setFunction(prevState => ({ ...prevState, image: file }));
    } else {
      toast({
        title: "File size exceeds 10MB limit",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      setAddLoading(true);
      let formData = new FormData();
      formData.append('product_name', newProduct.product_name);
      formData.append('sub_category_id', newProduct.sub_category_id);
      formData.append('category_id', newProduct.category_id);
      formData.append('status', 'active');
      formData.append('image', newProduct.image);

      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      await axios.post('http://localhost:5000/api/v1/product/add', formData, config);
      setShowAddModal(false);
      fetchProducts();
      toast({
        title: "Product added successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to add product",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditProduct = async () => {
    try {
      setEditLoading(true);
      let formData = new FormData();
      formData.append('product_name', editProductData.product_name);
      formData.append('category_id', editProductData.category_id);
      formData.append('sub_category_id', editProductData.sub_category_id);
      formData.append('image', editProductData.image);
      formData.append('status', editProductData.status);

      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      await axios.put(`http://localhost:5000/api/v1/product/edit/${currentProduct.id}`, formData, config);
      setShowEditModal(false);
      fetchProducts();
      toast({
        title: "Product updated successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update product",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setDeleteLoading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.delete(`http://localhost:5000/api/v1/product/delete/${deleteProductId}`, config);
      setShowDeleteModal(false);
      fetchProducts();
      toast({
        title: "Product deleted successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete product",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container fluid>
      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
              >
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.category_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control
                as="select"
                value={newProduct.sub_category_id}
                onChange={(e) => setNewProduct({ ...newProduct, sub_category_id: e.target.value })}
              >
                <option value="" disabled>Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.subcategory_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Name"
                value={newProduct.product_name}
                onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => handleFileChange(e, setNewProduct)}
              />
              <Form.Text className="text-muted">
                Max file size: 10MB
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddProduct}
            disabled={addLoading || !isFileSizeValid(newProduct.image)}
          >
            {addLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={editProductData.category_id}
                onChange={(e) => setEditProductData({ ...editProductData, category_id: e.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.category_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control
                as="select"
                value={editProductData.sub_category_id}
                onChange={(e) => setEditProductData({ ...editProductData, sub_category_id: e.target.value })}
              >
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.subcategory_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Name"
                value={editProductData.product_name}
                onChange={(e) => setEditProductData({ ...editProductData, product_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => handleFileChange(e, setEditProductData)}
              />
              <Form.Text className="text-muted">
                Max file size: 10MB
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editProductData.status}
                onChange={(e) => setEditProductData({ ...editProductData, status: e.target.value })}
                style={{ color: editProductData.status === "active" ? "green" : "red" }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditProduct}
            disabled={editLoading || (editProductData.image && !isFileSizeValid(editProductData.image))}
          >
            {editLoading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-3">
        <Col xs={12} md="auto" className='d-flex align-items-center'>
          <Image src="/product_icon.png" alt="Product Logo" width="30" className="me-2" style={{ objectFit: 'contain' }} />
          <h2 style={{ marginBottom: "0" }}>Products</h2>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search products"
              aria-label="Search products"
              className="pe-5"
            />
          </div>
        </Col>
        <Col xs={12} md="auto" className="mt-2 mt-md-0">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Product</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th className="align-middle">Id</th>
                <th className="align-middle">Product Name</th>
                <th className="align-middle">Category ID</th>
                <th className="align-middle">Subcategory ID</th>
                <th className="align-middle">Image</th>
                <th className="align-middle">Status</th>
                <th className="align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-bottom">
                  <td className="align-middle bg-light">{product.id}</td>
                  <td className="align-middle bg-light">{product.product_name}</td>
                  <td className="align-middle bg-light">{product.category_id}</td>
                  <td className="align-middle bg-light">{product.sub_category_id}</td>
                  <td className="align-middle bg-light">
                    <img src={product.image} alt={product.product_name} width="50" className="mx-auto d-block" />
                  </td>
                  <td className={`align-middle bg-light ${product.status === 'Active' ? 'text-success' : 'text-danger'}`}>
                    {product.status}
                  </td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 me-2"
                      onClick={() => {
                        setCurrentProduct(product);
                        setEditProductData({
                          product_name: product.product_name,
                          category_id: product.category_id,
                          sub_category_id: product.sub_category_id,
                          image: null,
                          status: product.status,
                        });
                        setShowEditModal(true);
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="link"
                      className="p-0"
                      size="sm"
                      onClick={() => {
                        setDeleteProductId(product.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Product;