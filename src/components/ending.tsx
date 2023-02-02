import Choice from "./choice";
import _ from "lodash";
import Photopara from "./photopara";
import { useState } from "react";

function Ending(props: {
	title: string;
	traits: any;
	description: string;
	data: any;
	stateTraits: any;
	gameState: any;
	setState: any;
}) {
	const [accepted, setAccepted] = useState(false);
	function conditionParser(condition?: {
		conditional: string;
		a: string[];
		b: any;
	}) {
		if (condition) {
			var ayys: any[] = [];
			condition.a.forEach((ayy: string) => {
				var a: any;
				var aArray = ayy.split(".");
				if (props.gameState[aArray[0]] && aArray[1]) {
					a = [];
					props.gameState[aArray[0]].forEach((celeb: any) => {
						ayys.push(celeb[aArray[1]]);
					});
				} else if (props.gameState[aArray[0]]) {
					a = props.gameState[aArray[0]];
					ayys.push(a);
				} else {
					a = "";
				}
			});
			return {
				conditional: condition.conditional,
				a: ayys,
				b: condition.b,
			};
		} else return null;
	}

	function conditionalChecker() {
		var checked = 0;
		var result = false;
		var currentMax: string | undefined = "";
		var maximum = "";

		if (accepted) {
			return true;
		} else {
			_.forIn(props.traits, (trait: any, key: string) => {
				if (trait.maximum) {
					maximum = key;
					currentMax = _.max(Object.values(props.stateTraits));
				}
				if (
					props.stateTraits[key] <= trait.upper &&
					props.stateTraits[key] >= trait.lower
				) {
					checked++;
				}
			});
			if (checked === Object.values(props.stateTraits).length) {
				result = true;
			}
			if (result && maximum === "") {
				return true;
			} else if (result) {
				return props.stateTraits[maximum] === currentMax;
			} else {
				return false;
			}
		}
	}

	if (conditionalChecker()) {
		return (
			<div className="choice">
				<div className="title">{props.title}</div>
				<div className="paragraph choices-description">
					{props.description}
				</div>

				{props.data.map((component: any) => {
					if (component.type === "choice" && component.choices) {
						return (
							<Choice
								title={component.title}
								choices={component.choices}
								description={component.description}
								maxChoice={component.pick}
								condition={conditionParser(component.condition)}
								state={props.gameState}
								setState={props.setState}
							></Choice>
						);
					} else if (
						component.type === "photopara" &&
						typeof component.description !== "string"
					) {
						return (
							<Photopara
								title={component.title}
								condition={conditionParser(component.condition)}
								celeb={component.celeb}
								description={component.description}
							></Photopara>
						);
					} else if (component.type === "button" && !accepted) {
						return (
							<div
								className="button"
								onClick={() => {
									setAccepted(true);
								}}
							>
								{component.text}
							</div>
						);
					} else return <></>;
				})}
			</div>
		);
	} else {
		return <></>;
	}
}

export default Ending;
