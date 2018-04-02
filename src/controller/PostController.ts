import {ArgsValidator, Controller, Mutation, Query} from "vesper";
import {EntityManager, FindManyOptions} from "typeorm";
import {TextGenerator} from "../service/TextGenerator";
import {Post} from "../entity/Post";
import {PostsArgs} from "../args/PostsArgs";
import {PostSaveArgs} from "../args/PostSaveArgs";
import {Category} from "../entity/Category";
import {PostsArgsValidator} from "../validator/PostsArgsValidator";

@Controller()
export class PostController {

    constructor(private entityManager: EntityManager,
                private textGenerator: TextGenerator) {
    }

    @Query()
    @ArgsValidator(PostsArgsValidator)
    posts(args: PostsArgs) {

        let findOptions: FindManyOptions = {};
        if (args.limit)
            findOptions.take = args.limit;
        if (args.offset)
            findOptions.skip = args.offset;
        if (args.sortBy === "last")
            findOptions.order = { "id": "DESC" };
        if (args.sortBy === "name")
            findOptions.order = { "name": "ASC" };

        return this.entityManager.find(Post, findOptions);
    }

    @Query()
    post({ id }) {
        return this.entityManager.findOne(Post, id);
    }

    @Mutation()
    async postSave(args: PostSaveArgs) {

        const post = args.id ? await this.entityManager.findOneOrFail(Post, args.id) : new Post();
        post.title = args.title;
        post.text = args.text ? args.text : this.textGenerator.generate();
        if (args.categoryIds) {
            post.categories = await Promise.all(args.categoryIds.map(categoryId => {
                return this.entityManager.findOne(Category, categoryId);
            }));
        }

        return this.entityManager.save(Post, post);
    }

    @Mutation()
    async postDelete({ id }) {
        await this.entityManager.remove({ id: id });
        return true;
    }

}