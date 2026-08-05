import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Button, Col, Container, Form, Input, Label, Row } from 'reactstrap'
import { compose } from 'redux'
import useForm from '../../Hooks/useForm'
import { addQuestion } from '../../Store/actions/forumActions'
 
const AddQuestionForm = ({addQuestion, courses, user}) => {
    const userName = user.name
    const handleClass = () => {
        addQuestion(inputs)
    }


    const { inputs, handleInputChange, handleSubmit} = useForm({topic: '', question: '', user: userName}, handleClass)

    return(
        <Form onSubmit={handleSubmit}>
            <Container>
                <Col>
                    <Row className="mt-2">
                        <Label htmlFor="question">Question</Label>
                        <Input type="textarea"  id="question" placeholder="Type your question here" onChange={handleInputChange}></Input>
                    </Row>
                    <Row className="mt-2">
                        <Label htmlFor="topic">Course</Label>
                        <Input type="select" className="selector" name="select" id="topic" onChange={handleInputChange}>
                            <option>Choose Course</option>
                            {courses && courses.map(course => (
                                <option key={course.id} value={course.title}>{course.title}</option>
                            ))}           
                        </Input>
                    </Row>
                </Col>
                <Button type="submit" className="button mt-4">
                    Add Question 
                </Button>
            </Container>
        </Form>
    )
}


const mapStateToProps = (state) => {
    return{
        courses: state.firestore.ordered.courses,
        user: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return({
        addQuestion: (newClass) => {
            dispatch(addQuestion(newClass))
        }
    })
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps), 
    firestoreConnect([
        {
            collection: 'courses'
        },
    ])
)(AddQuestionForm);