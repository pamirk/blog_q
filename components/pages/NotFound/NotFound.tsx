import { ResourceNotFoundError } from 'helpers/errors';

// Throw an error that will be caught by the error boundary and will

// resolve to 404.
function index() {
	// throw new ResourceNotFoundError();
	return <div>404 NotFound Component</div>
}
export default index;

