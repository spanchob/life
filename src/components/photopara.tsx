import React from "react";
import Paragraph from "./paragraph";
import _ from "lodash";

function Photopara(props: {
	celeb: any;
	title: string;
	description: string[];
	condition: any;
}) {
	function parseCondition(condition?: any) {
		if (condition && condition.conditional) {
			if (condition.conditional === "equals") {
				return condition.a === condition.b;
			} else if (condition.conditional === "gt") {
				return condition.a > condition.b;
			} else if (condition.conditional === "lt") {
				return condition.a < condition.b;
			} else if (condition.conditional === "gte") {
				return condition.a >= condition.b;
			} else if (condition.conditional === "lte") {
				return condition.a <= condition.b;
			} else if (condition.conditional === "intersect") {
				var result = _.intersection(condition.a, condition.b);
				if (result.length === condition.b.length) {
					return true;
				} else {
					return false;
				}
			}
		} else return true;
	}
	if (parseCondition(props.condition)) {
		return (
			<div className="photopara">
				<div className="choice-card">
					<div className="choice-image">
						<img
							className="choice-image"
							src={"celebs/" + props.celeb.image}
							alt={props.celeb.name}
						/>
					</div>
					<div className="name">{props.celeb.name}</div>
				</div>
				<Paragraph
					title={props.title}
					description={props.description}
				></Paragraph>
			</div>
		);
	} else {
		return <></>;
	}
}

export default Photopara;
