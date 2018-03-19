import {Service} from "typedi";

@Service()
export class TextGenerator {

    generate() {
        // here you can generate text for your posts using any faker data library
        const random = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
        return "text #" + random;
    }

}