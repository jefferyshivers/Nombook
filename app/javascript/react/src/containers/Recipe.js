import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
  Editor, 
  RichUtils,
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import { changeMetaField, changeStep, addAStep, clearForm, fork } from '../actions/editor';
import { Nombook as NB } from '../api';
import '../styles/containers/Recipe_RecipeForm.scss';

class Recipe extends Component {
  constructor(props) {
    super(props)
    this.loadRecipe = this.loadRecipe.bind(this)
    this.handleChangeMetaField = this.handleChangeMetaField.bind(this)
    this.handleChangeStep = this.handleChangeStep.bind(this)
    this.handleAddStep = this.handleAddStep.bind(this)
    this.handleSaveUpdatedRecipe = this.handleSaveUpdatedRecipe.bind(this)
    this.handleCancelEdits = this.handleCancelEdits.bind(this)
    this.handleDeleteStep = this.handleDeleteStep.bind(this)
    this.handleDeleteRecipe = this.handleDeleteRecipe.bind(this)
    this.handleFork = this.handleFork.bind(this)
    this.handleLike = this.handleLike.bind(this)
    this.handleUnlike = this.handleUnlike.bind(this)
    this._onBoldClick = this._onBoldClick.bind(this)
    this._onItalicClick = this._onItalicClick.bind(this)
    this._onUnderlineClick = this._onUnderlineClick.bind(this)
    this.focusMetaField = this.focusMetaField.bind(this)
    this.focusStep = this.focusStep.bind(this)    
    this.state = {
      editing: false,
      recipe: {
        name: EditorState.createEmpty(),
        description: EditorState.createEmpty(),
        ingredients_body: EditorState.createEmpty(),
        id: null
      },
      steps: [],
      forked_from: null,
      owner: {},
      photo_url: "",
      current_user_liked: null,
      likes: [],
      selected_field: null      
    }
  }

  _onBoldClick() {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        console.log('meta field')
        this.handleChangeMetaField(arg, RichUtils.toggleInlineStyle(this.state.recipe[arg], 'BOLD'))
      } else {
        this.handleChangeStep(arg, RichUtils.toggleInlineStyle(this.state.steps[arg].body, 'BOLD'))
      }
    }
  }
  _onItalicClick() {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.handleChangeMetaField(arg, RichUtils.toggleInlineStyle(this.state.recipe[arg], 'ITALIC'))
      } else {
        this.handleChangeStep(arg, RichUtils.toggleInlineStyle(this.state.steps[arg].body, 'ITALIC'))
      }
    }
  }
  _onUnderlineClick() {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.handleChangeMetaField(arg, RichUtils.toggleInlineStyle(this.state.recipe[arg], 'UNDERLINE'))
      } else {
        this.handleChangeStep(arg, RichUtils.toggleInlineStyle(this.state.steps[arg].body, 'UNDERLINE'))
      }
    }
  }

  _toggleBlockType(blockType) {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.handleChangeMetaField(arg, RichUtils.toggleBlockType(this.state.recipe[arg], blockType))
      } else {
        this.handleChangeStep(arg, RichUtils.toggleBlockType(this.state.steps[arg].body, blockType))
      }
    }
  }

  focusMetaField(field) {
    this.setState({selected_field: {type: 'META_FIELD', arg: field}})
  }

  focusStep(index) {
    this.setState({selected_field: {type: 'STEP', arg: index}})
  }

  componentWillMount() {
    this.loadRecipe()
  }

  loadRecipe() {
    const nb = new NB();

    nb.request('GET', `/recipes/${this.props.match.params.id}`, res => {
      if (res.recipe) {
        let recipe = Object.assign({}, res.recipe, {
          name: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.name))),
          description: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.description))),
          ingredients_body: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.ingredients_body))),
          id: res.recipe.id
        })
        let steps = res.steps.map(step => {
          return {
            index_in_recipe: step.index_in_recipe,
            body: EditorState.createWithContent(convertFromRaw(JSON.parse(step.body)))
          }
        })
        let forked_from = (res.forked_from) ? Object.assign({}, res.forked_from, {
          name: EditorState.createWithContent(convertFromRaw(JSON.parse(res.forked_from.name))),
          description: EditorState.createWithContent(convertFromRaw(JSON.parse(res.forked_from.description))),
          ingredients_body: EditorState.createWithContent(convertFromRaw(JSON.parse(res.forked_from.ingredients_body)))
        }) : null

        this.setState({
          recipe: recipe, 
          steps: steps, 
          forked_from: forked_from, 
          editing: false,
          owner: res.owner,
          photo_url: res.photo_url,
          current_user_liked: res.current_user_liked,
          likes: res.likes
        })
      } else {
        this.props.history.push("/");
        console.log('Something went wrong while trying to load this recipe.');
      }
    })
  }

  handleChangeMetaField(field, editorState) {
    this.setState({
      recipe: Object.assign({}, this.state.recipe, {
        [field]: editorState
      })
    })
  }

  handleChangeStep(index_in_recipe, editorState) {
    let steps = this.state.steps
    steps[index_in_recipe].body = editorState
    this.setState({
      steps: steps
    })
  }

  handleAddStep() {
    let new_step_blueprint = {
      index_in_recipe: this.state.steps.length,
      body: EditorState.createEmpty()
    }
    this.setState({
      steps: this.state.steps.concat(new_step_blueprint)
    })
  }

  handleDeleteStep(index) {
    if (index === this.state.steps[index].index_in_recipe) {
      let steps = this.state.steps;
      steps.splice(index, 1);
      steps = steps.map((step, index) => {
        return {
          index_in_recipe: index,
          body: step.body
        }
      })

      this.setState({
        steps: steps
      })
    } else {
      console.log('The indeces do not match!')
    }
  }

  handleSaveUpdatedRecipe() {
    const nb = new NB();

    let steps = this.state.steps.map(step => {
      return {
        index_in_recipe: step.index_in_recipe,
        body: JSON.stringify(convertToRaw(step.body.getCurrentContent()))
      }
    })
    let body = {
      name: JSON.stringify(convertToRaw(this.state.recipe.name.getCurrentContent())),
      description: JSON.stringify(convertToRaw(this.state.recipe.description.getCurrentContent())),
      ingredients_body: JSON.stringify(convertToRaw(this.state.recipe.ingredients_body.getCurrentContent())),
      steps: steps
    }
    let params = {
      method: 'PATCH',
      body: JSON.stringify(body)
    }

    nb.request(params, `/users/${this.props.current_user.id}/recipes/${this.state.recipe.id}`, res => {
      if (res.saved) {
        let recipe = Object.assign({}, res.recipe, {
          name: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.name))),
          description: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.description))),
          ingredients_body: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.ingredients_body))),
        })
        let steps = res.steps.map(step => {
          return {
            index_in_recipe: step.index_in_recipe,
            body: EditorState.createWithContent(convertFromRaw(JSON.parse(step.body)))
          }
        })

        this.setState({
          editing: false,
          recipe: recipe,
          steps: steps
        })
      } else {
        console.log('no good');
      }
    })
  }

  handleDeleteRecipe() {
    let recipe = this.state.recipe
    let id = recipe.id
    // TODO add a confirmation alert here
    let nb = new NB();

    nb.request('DELETE', `/users/${this.props.current_user.id}/recipes/${this.state.recipe.id}`, res => {
      if (res.deleted) {
        this.props.history.push(`/users/${this.props.current_user.username}`);
      } else {
        console.log('Something went wrong.');
      }
    })
  }

  handleCancelEdits() {
    this.setState({
      editing: false
    })
    this.loadRecipe()
  }

  handleFork() {
    this.props.history.push("/recipes/new");
    let params = {
      id: this.state.recipe.id,
      name: this.state.recipe.name,
      ingredients_body: this.state.recipe.ingredients_body,
      steps: this.state.steps
    }

    this.props.onFork(params);
  }

  handleLike() {
    const nb = new NB();
    
    let body = {
      recipe_id: this.state.recipe.id
    }

    let params = {
      method: 'PATCH',
      body: JSON.stringify(body)
    }

    nb.request(params, `/likes/${this.props.current_user.id}`, res => {
      if (res.saved) {
        this.setState({
          current_user_liked: res.current_user_liked,
          likes: res.likes
        })
      } else {
        console.log('Something went wrong here.')
      }
    })
  }

  handleUnlike() {
    const nb = new NB();
    
    let body = {
      recipe_id: this.state.recipe.id
    }

    let params = {
      method: 'DELETE',
      body: JSON.stringify(body)
    }

    nb.request(params, `/likes/${this.props.current_user.id}`, res => {
      if (res.saved) {
        this.setState({
          current_user_liked: res.current_user_liked,
          likes: res.likes
        })
      } else {
        console.log('Something went wrong here.')
      }
    })  }

  render() {
    // this is a quick hack to rerender the component, since react-router blocks it from normally reloading
    // for more details on this issue, see: https://github.com/ReactTraining/react-router/issues/5037
    if (this.state.recipe.id && this.props.match.params.id !== this.state.recipe.id.toString()) {
      this.loadRecipe()
    }

    const forked_from_message = (this.state.forked_from) ? (
      <div className="forked-from">
        <Link to={`/recipes/${this.state.forked_from.id}`} className="forked-from-button">
          <div className="label">Forked from</div>
          <Editor 
            readOnly={true}
            editorState={this.state.forked_from.name} 
            onChange={() => {}} />
        </Link>
      </div>
    ) : null


    {/* edit or fork button */}
    const edit_button = (this.state.recipe.user_id === this.props.current_user.id) ? (
      <div className="button" id="edit" onClick={() => {this.setState({editing: true})}}>
        edit
      </div>
    ) : null
    const like_button = (this.state.current_user_liked) ? (
      <div className="button" id="like" onClick={this.handleUnlike}>
        <i className="material-icons">favorite</i>
        liked
      </div>
    ) : (
      <div className="button" id="like" onClick={this.handleLike}>
        <i className="material-icons">favorite_border</i>
        like
      </div>
    )
    const edit_or_fork_button = (
      <div className="edit-or-fork-button-container">
        {edit_button}
        {like_button}
        <div className="button" id="fork" onClick={this.handleFork}>
          <i className="material-icons">call_split</i>
          {" fork"}
        </div>
      </div>
    )

    {/* control panel */}
    const control_panel = (
      <div className="control-panel">

        <div className="style-button-group">
          <div className="button" onClick={this._onBoldClick}> <i className="material-icons">format_bold</i> </div>
          <div className="button" onClick={this._onItalicClick}> <i className="material-icons">format_italic</i> </div>
          <div className="button" onClick={this._onUnderlineClick}> <i className="material-icons">format_underline</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('unordered-list-item')}}> <i className="material-icons">format_list_bulleted</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('ordered-list-item')}}> <i className="material-icons">format_list_numbered</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('code-block')}}> <i className="material-icons">code</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('blockquote')}}> <i className="material-icons">format_quote</i> </div>
        </div>

        <div className="meta-button-group">
          <div 
            className="button" 
            id="save"
            onClick={this.handleSaveUpdatedRecipe}
            title="save form">
            Save
          </div>
          <div 
            className="button" 
            id="cancel"
            onClick={this.handleCancelEdits}
            title="cancel edits">
            Cancel
          </div>
        </div>
      </div>
    )
    {/* edit/fork button or control panel */}
    const edit_fork_button_or_control_panel = (this.state.editing) ? control_panel : edit_or_fork_button


    const background = (this.state.photo_url) ? {
      backgroundImage: `url(${this.state.photo_url})`,
      backgroundSize: 'cover'
    } : null
    const recipe_photo = (this.state.photo_url) ? (
      <div className="photo-container">
        <div className="photo" style={background}></div>
      </div>
    ) : null

    {/* meta card */}
    const meta = (
      <div className="meta">

        {/* name */}
        <div className={(this.state.editing) ? "name editing" : "name"}>
          <Editor 
            spellCheck={true}
            onFocus={() => {this.focusMetaField("name")}}
            readOnly={!this.state.editing}
            editorState={this.state.recipe.name} 
            onChange={(e) => {this.handleChangeMetaField("name", e)}} />
        </div>

        {/* author */}
        <div className="author">
          {"by "}
          <Link to={`/users/${this.state.owner.username}`}>
            {this.state.owner.username}
          </Link>
        </div>

        {forked_from_message}

        {recipe_photo}
        
        {/* description */}
        <div className={(this.state.editing) ? "description editing" : "description"}>
          <Editor 
            spellCheck={true}
            onFocus={() => {this.focusMetaField("description")}}
            readOnly={!this.state.editing}
            editorState={this.state.recipe.description} 
            onChange={(e) => {this.handleChangeMetaField("description", e)}} />
        </div>
      </div>
    )

    {/* ingredients card */}
    const ingredients = (
      <div className="ingredients">
        <div className='label'>
          Ingredients
        </div>
        <div className={(this.state.editing) ? "ingredients-body editing" : "ingredients-body"}>
          <Editor 
            spellCheck={true}
            onFocus={() => {this.focusMetaField("ingredients_body")}}
            readOnly={!this.state.editing}
            editorState={this.state.recipe.ingredients_body} 
            onChange={(e) => {this.handleChangeMetaField("ingredients_body", e)}} />
        </div>
      </div>
    )

    {/* steps card */}
    const steps = this.state.steps.map(step => {
      return(
        <div className="step-container" key={step.index_in_recipe}>
          <div className="step-index-container">
            <div className="step-index-number">
              {step.index_in_recipe + 1}
            </div>
            {(this.state.editing) ? (
              <div className="step-index-delete">
                <i 
                  className="material-icons" 
                  onClick={() => {this.handleDeleteStep(step.index_in_recipe)}}>
                  delete
                </i>
              </div>
            ) : null}
          </div>
          <div className={(this.state.editing) ? "step editing" : "step"}>
            <Editor 
              spellCheck={true}
              onFocus={() => {this.focusStep(step.index_in_recipe)}}
              readOnly={!this.state.editing}
              editorState={step.body} 
              onChange={(e) => {this.handleChangeStep(step.index_in_recipe, e)}} />
          </div>
        </div>
      )
    })
    const add_a_step_button = (this.state.editing) ? (
      <div className="add-a-step-button-container">
        <div className="add-a-step-button" onClick={this.handleAddStep}>
          Add a step
        </div>
      </div>
    ) : null
    const method = (
      <div className='method'>
        <div className='label'>
          Method
        </div>
        {steps}
        {add_a_step_button}
      </div>
    )

    {/* delete recipe button */}
    const delete_recipe_button = (this.state.editing) ? (
      <div className="delete-recipe-button-container">
        <div className="delete-recipe-button" onClick={this.handleDeleteRecipe}>
          Delete recipe
        </div>
      </div>
    ) : null

    return(
      <div className='Recipe'>
        {edit_fork_button_or_control_panel}
        {meta}
        {ingredients}
        {method}
        {delete_recipe_button}        
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    editor: state.editor,
    current_user: state.current_user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeMetaField: (field, editorState) => {
      dispatch(changeMetaField(field, editorState))
    },
    onChangeStep: (index_in_recipe, editorState) => {
      dispatch(changeStep(index_in_recipe, editorState))
    },
    onAddAStep: () => {
      dispatch(addAStep())
    },
    onClearForm: () => {
      dispatch(clearForm())
    },
    onFork: (params) => {
      dispatch(fork(params))
    }
  }
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe));
