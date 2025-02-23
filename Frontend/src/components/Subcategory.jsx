import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Image, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { TablesprintState } from '../contexts/TablesprintContext';
import { useToast } from "@chakra-ui/react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const isFileSizeValid = (file) => {
  return file && file.size <= MAX_FILE_SIZE;
};

const SubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = TablesprintState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  
  const [newSubcategory, setNewSubcategory] = useState({ 
    subcategory_name: '', 
    category_id: '', 
    sub_category_sequence: '', 
    image: null 
  });
  const [editSubcategoryData, setEditSubcategoryData] = useState({ 
    subcategory_name: '', 
    category_id: '', 
    sub_category_sequence: '', 
    image: null, 
    status: '' 
  });
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get('http://localhost:5000/api/v1/subcategory/', config);
      setSubcategories(response.data.data);      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch subcategories');
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

  const handleAddSubcategory = async () => {
    try {
      setAddLoading(true);
      let formData = new FormData();
      formData.append('subcategory_name', newSubcategory.subcategory_name);
      formData.append('category_id', newSubcategory.category_id);
      formData.append('sub_category_sequence', newSubcategory.sub_category_sequence);
      formData.append('status', 'active');
      formData.append('image', newSubcategory.image);

      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      await axios.post('http://localhost:5000/api/v1/subcategory/add', formData, config);
      setShowAddModal(false);
      fetchSubcategories();
      toast({
        title: "Subcategory added successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to add subcategory",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSubcategory = async () => {
    try {
      setEditLoading(true);
      let formData = new FormData();
      formData.append('subcategory_name', editSubcategoryData.subcategory_name);
      formData.append('category_id', editSubcategoryData.category_id);
      formData.append('sub_category_sequence', editSubcategoryData.sub_category_sequence);
      formData.append('image', editSubcategoryData.image);
      formData.append('status', editSubcategoryData.status);

      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      await axios.put(`http://localhost:5000/api/v1/subcategory/edit/${currentSubcategory.id}`, formData, config);
      setShowEditModal(false);
      fetchSubcategories();
      toast({
        title: "Subcategory updated successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update subcategory",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    try {
      setDeleteLoading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.delete(`http://localhost:5000/api/v1/subcategory/delete/${deleteSubcategoryId}`, config);
      setShowDeleteModal(false);
      fetchSubcategories();
      toast({
        title: "Subcategory deleted successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete subcategory",
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
      {/* Add Subcategory Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Sub Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control 
                as="select"
                value={newSubcategory.category_id}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
              >
                <option value="" disabled>Select Category Name</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.category_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sub category name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter Sub Category Name"
                value={newSubcategory.subcategory_name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, subcategory_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sub Category Sequence</Form.Label>
              <Form.Control 
                type="number"
                placeholder="Enter sequence"
                value={newSubcategory.sub_category_sequence}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, sub_category_sequence: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => handleFileChange(e, setNewSubcategory)}
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
            onClick={handleAddSubcategory} 
            disabled={addLoading || !isFileSizeValid(newSubcategory.image)}
          >
            {addLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Subcategory Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sub Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control 
                as="select"
                value={editSubcategoryData.category_id}
                onChange={(e) => setEditSubcategoryData({ ...editSubcategoryData, category_id: e.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.category_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sub category name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter Sub Category Name"
                value={editSubcategoryData.subcategory_name}
                onChange={(e) => setEditSubcategoryData({ ...editSubcategoryData, subcategory_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sub Category Sequence</Form.Label>
              <Form.Control 
                type="number"
                placeholder="Enter sequence"
                value={editSubcategoryData.sub_category_sequence}
                onChange={(e) => setEditSubcategoryData({ ...editSubcategoryData, sub_category_sequence: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => handleFileChange(e, setEditSubcategoryData)}
              />
              <Form.Text className="text-muted">
                Max file size: 10MB
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editSubcategoryData.status}
                onChange={(e) => setEditSubcategoryData({ ...editSubcategoryData, status: e.target.value })}
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
            onClick={handleEditSubcategory} 
            disabled={editLoading || (editSubcategoryData.image && !isFileSizeValid(editSubcategoryData.image))}
          >
            {editLoading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Subcategory Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Sub Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this subcategory?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubcategory} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-3">
        <Col xs={12} md="auto" className='d-flex align-items-center'>
          <Image src="/subcategory_logo.png" alt="Subcategory Logo" width="30" className="me-2" style={{objectFit:'contain'}} />
          <h2 style={{marginBottom:"0"}}>Sub Category</h2>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <div className="position-relative">
            <Form.Control 
              type="text" 
              placeholder="Search subcategories"
              aria-label="Search subcategories" 
              className="pe-5"
            />
          </div>
        </Col>
        <Col xs={12} md="auto" className="mt-2 mt-md-0">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Sub Category</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th className="align-middle">Id</th>
                <th className="align-middle">SubCategory name</th>
                <th className="align-middle">Category ID</th>
                <th className="align-middle">Image</th>
                <th className="align-middle">Status</th>
                <th className="align-middle">Sequence</th>
                <th className="align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory) => (
                <tr key={subcategory.id} className="border-bottom">
                  <td className="align-middle bg-light">{subcategory.id}</td>
                  <td className="align-middle bg-light">{subcategory.subcategory_name}</td>
                  <td className="align-middle bg-light">{subcategory.category_id}</td>
                  <td className="align-middle bg-light">
                    <img src={subcategory.image} alt={subcategory.name} width="50" className="mx-auto d-block"  />
                  </td>
                  <td className={`align-middle bg-light ${subcategory.status === 'Active' ? 'text-success' : 'text-danger'}`}>
                    {subcategory.status}
                  </td>
                  <td className="align-middle bg-light">{subcategory.sub_category_sequence}</td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 me-2"
                      onClick={() => {
                        setCurrentSubcategory(subcategory);
                        setEditSubcategoryData({
                          subcategory_name: subcategory.subcategory_name,
                          category_id: subcategory.category_id,
                          sub_category_sequence: subcategory.sub_category_sequence,
                          image: null,
                          status: subcategory.status,
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
                        setDeleteSubcategoryId(subcategory.id);
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

export default SubCategory;