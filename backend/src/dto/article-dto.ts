import { ContentlessArticleDTO } from "@dto/contentless-article-dto";
import { ClassToObject } from "@util-types";

export type ArticleDTOProps = ClassToObject<ArticleDTO>;

export class ArticleDTO extends ContentlessArticleDTO {
  public readonly content: string;

  public constructor(props: ArticleDTOProps) {
    super(props);
    this.content = props.content;
  }
}
