import { Observable } from "rxjs/Observable";

export  class HandleError {

    public static handleError(error: Response) {
        alert(error.toString());
    }
}