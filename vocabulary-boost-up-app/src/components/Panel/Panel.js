import "./Panel.css";
import { Row, Col, Dropdown, Menu, Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import CustomFlashcard from "../Flashcards/Flashcard";
import { baseURL } from "../../config";

const { TextArea } = Input;

const Panel = () => {
  const [vocabularyData, setVocabularyData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addingVocabulary, setAddingVocabulary] = useState(null);
  const [editingVocabulary, setEditingVocabulary] = useState(null);
  const [messageApi, resultMessageHolder] = message.useMessage();

  const success = (message) => {
    messageApi.open({
      type: "success",
      content: `${message}`,
      style: {
        marginTop: "90px",
      },
      duration: 2,
    });
  };

  const error = (message) => {
    messageApi.open({
      type: "error",
      content: `${message}`,
      style: {
        marginTop: "90px",
      },
      duration: 2,
    });
  };

  const handleDelete = (id) => {
    deleteVocabularyById(id);
    getVocabulary();
  };

  const handleEdit = (id, english, polish) => {
    setEditingVocabulary({ id: id, english: english, polish: polish });
    setIsEditing(true);
  };

  const onAddVocabulary = () => {
    setIsAdding(true);
    setAddingVocabulary(null);
  };

  const resetAdding = () => {
    setIsAdding(false);
    setAddingVocabulary(null);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingVocabulary(null);
  };

  const handleOption = (key, id, english, polish) => {
    if (key.key === "edit") {
      handleEdit(id, english, polish);
    } else if (key.key === "delete") {
      handleDelete(id);
    }
  };

  const menuOptions = (vocabularyId, english, polish) => {
    return (
      <Menu
        onClick={(key) => handleOption(key, vocabularyId, english, polish)}
        items={[
          {
            label: "Edit card",
            key: "edit",
          },
          {
            label: "Delete card",
            key: "delete",
          },
        ]}
      />
    );
  };

  function convert(data) {
    return data.json();
  }

  const createNewVocabulary = () => {
    fetch(`${baseURL}/vocabulary`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(addingVocabulary),
    })
      .then((response) => {
        // eslint-disable-next-line
        if (response.status == 201) {
          resetAdding();
          getVocabulary();
          success("New vocabulary added successfully!");
        } else {
          convert(response).then((resp) => {
            if (resp.message) {
              error(resp.message);
            } else {
              error("Error! Could not create new vocabulary.");
            }
          });
        }
      })
      .catch((err) => {
        error("Error! Could not create new vocabulary.");
        console.error("Error while fetching data: ", err);
        resetAdding();
      });
  };

  const editVocabulary = () => {
    fetch(`${baseURL}/vocabulary/${editingVocabulary.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        english: editingVocabulary.english,
        polish: editingVocabulary.polish,
      }),
    })
      .then((response) => {
        // eslint-disable-next-line
        if (response.status == 200) {
          resetEditing();
          getVocabulary();
          success("Vocabulary updated successfully!");
        } else {
          convert(response).then((resp) => {
            if (resp.message) {
              error(resp.message);
            } else {
              error("Error! Could not update vocabulary.");
            }
          });
        }
      })
      .catch((err) => {
        error("Error! Could not update vocabulary.");
        console.error("Error while fetching data: ", err);
        resetEditing();
      });
  };

  const getVocabulary = () => {
    fetch(`${baseURL}/vocabulary`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.sort((a, b) => {
          return a.id - b.id;
        });
        setVocabularyData(data);
      })
      .catch((err) => {
        console.error("Error while fetching data: ", err);
      });
  };

  const deleteVocabularyById = (id) => {
    fetch(`${baseURL}/vocabulary/${id}`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        // eslint-disable-next-line
        if (response.status == 200) {
          getVocabulary();
          success("Vocabulary deleted successfully");
        } else {
          convert(response).then((resp) => {
            if (resp.message) {
              error(resp.message);
            } else {
              error("Error! Could not delete vocabulary.");
            }
          });
        }
      })
      .catch((err) => {
        error("Error! Could not delete vocabulary.");
        console.error("Error while fetching data: ", err);
      });
  };

  const fetchData = () => {
    getVocabulary();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {resultMessageHolder}
        <Row justify="end">
          <Button
            onClick={onAddVocabulary}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: 20 }}
          >
            Add new flashcard
          </Button>
        </Row>
        <Row gutter={[16, 16]}>
          {vocabularyData.map((vocabulary, i) => (
            <Col span={4}>
              <Dropdown
                overlay={menuOptions(
                  vocabulary.id,
                  vocabulary.english_version,
                  vocabulary.polish_version
                )}
                trigger={[`contextMenu`]}
                key={"id-" + vocabulary.id}
              >
                <div>
                  <CustomFlashcard
                    textFront={vocabulary.english_version}
                    textBack={vocabulary.polish_version}
                    textSize={
                      vocabulary.polish_version.length >= 250
                        ? "very-small"
                        : vocabulary.polish_version.length > 200 &&
                          vocabulary.polish_version.length < 250
                        ? "small"
                        : "medium"
                    }
                    key={vocabulary.id}
                  />
                </div>
              </Dropdown>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title="Edit vocabulary"
        open={isEditing}
        okText="Save"
        onCancel={() => {
          resetEditing();
        }}
        onOk={editVocabulary}
        style={{ marginTop: "200px" }}
      >
        <TextArea
          className="form-input"
          autoSize
          value={editingVocabulary?.english}
          minLength={2}
          maxLength={300}
          placeholder="English vocabulary"
          onChange={(e) => {
            setEditingVocabulary((pre) => {
              return { ...pre, english: e.target.value };
            });
          }}
        ></TextArea>
        <TextArea
          className="form-input"
          autoSize
          value={editingVocabulary?.polish}
          minLength={2}
          maxLength={300}
          placeholder="Polish translation"
          onChange={(e) => {
            setEditingVocabulary((pre) => {
              return { ...pre, polish: e.target.value };
            });
          }}
        ></TextArea>
      </Modal>

      <Modal
        title="Add new vocabulary"
        open={isAdding}
        okText="Save"
        onCancel={() => {
          resetAdding();
        }}
        onOk={createNewVocabulary}
        style={{ marginTop: "200px" }}
      >
        <TextArea
          className="form-input"
          autoSize
          value={addingVocabulary?.english}
          minLength={2}
          maxLength={300}
          placeholder="English vocabulary"
          onChange={(e) => {
            setAddingVocabulary((pre) => {
              return { ...pre, english: e.target.value };
            });
          }}
        ></TextArea>
        <TextArea
          className="form-input"
          autoSize
          value={addingVocabulary?.polish}
          minLength={2}
          maxLength={300}
          placeholder="Polish translation"
          onChange={(e) => {
            setAddingVocabulary((pre) => {
              return { ...pre, polish: e.target.value };
            });
          }}
        ></TextArea>
      </Modal>
    </>
  );
};

export default Panel;
