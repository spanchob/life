import React, { useEffect, useState } from "react";
import _ from "lodash";

function Choice(props: {
	title: string;
	description: string;
	choices: any[];
	maxChoice: number;
	condition?: any;
	state: any;
	setState: any;
}) {
	const [choice, setChoice] = useState<any[]>([]);

	function splitInTwos(array: string[]) {
		var result = [];
		var i = 0;
		var currentArray = [];
		while (i < array.length) {
			if (i % 2 === 0) {
				currentArray.push(array[i]);
			} else {
				currentArray.push(array[i]);
				result.push(currentArray);
				currentArray = [];
			}
			i++;
		}
		return result;
	}

	function parseCondition(condition?: any) {
		if (condition && condition.conditional) {
			if (condition.conditional === "equals") {
				return condition.a[0] === condition.b[0];
			} else if (condition.conditional === "gt") {
				return condition.a[0] > condition.b[0];
			} else if (condition.conditional === "lt") {
				return condition.a[0] < condition.b[0];
			} else if (condition.conditional === "gte") {
				return condition.a[0] >= condition.b[0];
			} else if (condition.conditional === "lte") {
				return condition.a[0] <= condition.b[0];
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

	useEffect(() => {
		if (choice.length !== 0 && parseCondition(props.condition) === false) {
			var newState = _.cloneDeep(props.state);
			var oldModifierParsed = splitInTwos(choice[0].modifier.split(" "));
			oldModifierParsed.forEach((modifier) => {
				newState[modifier[1]] =
					newState[modifier[1]] - parseInt(modifier[0]);
			});
			props.setState(newState);

			const newChoice = choice;
			newChoice.shift();
			setChoice(newChoice);
		}
	}, [choice, props]);

	function onSelect(selection: any) {
		if (
			!document
				.getElementById(selection.name)
				?.classList.contains("selected")
		) {
			const newChoice = choice;
			newChoice.push(selection);

			var modifierParsed = selection.modifier
				? splitInTwos(selection.modifier.split(" "))
				: [];

			var newState = _.cloneDeep(props.state);

			if (newChoice.length > props.maxChoice) {
				document
					.getElementById(choice[0].name)
					?.classList.remove("selected");

				var oldModifierParsed = newChoice[0].modifier
					? splitInTwos(newChoice[0].modifier.split(" "))
					: [];
				oldModifierParsed.forEach((modifier) => {
					newState[modifier[1]] =
						newState[modifier[1]] - parseInt(modifier[0]);
				});
				_.set(newState, props.title, choice);
				newChoice.shift();
			}

			console.log(_.isEqual(modifierParsed, []));

			if (_.isEqual(modifierParsed, [])) {
				_.set(newState, props.title, choice);
				document
					.getElementById(selection.name)
					?.classList.add("selected");
				setChoice(newChoice);

				props.setState(newState);
			} else {
				modifierParsed.forEach((modifier) => {
					newState[modifier[1]] =
						newState[modifier[1]] + parseInt(modifier[0]);
					console.log(_.isEqual(modifierParsed, []));
					if (
						newState[modifier[1]] >= 0 ||
						_.isEqual(modifierParsed, [])
					) {
						_.set(newState, props.title, choice);
						document
							.getElementById(selection.name)
							?.classList.add("selected");
						setChoice(newChoice);

						props.setState(newState);
					}
				});
			}
		}
	}
	if (parseCondition(props.condition)) {
		return (
			<div className="choice">
				<div className="title">{props.title}</div>
				{props.description ? (
					<div className="paragraph choices-description">
						{props.description}
					</div>
				) : (
					<></>
				)}
				<div className="choice-box">
					{props.choices.map((choice) =>
						choice ? (
							<div
								className="choice-card"
								id={choice?.name}
								onClick={() => onSelect(choice)}
							>
								<div className="choice-image">
									<img
										className="choice-image"
										src={"celebs/" + choice?.image}
										alt={choice?.name}
									/>
								</div>
								<div className="name">{choice?.name}</div>
								{choice?.modifier ? (
									<div className="modifier">
										{choice?.modifier}
									</div>
								) : (
									<></>
								)}
								{choice?.description ? (
									<div className="paragraph">
										{choice?.description}
									</div>
								) : (
									<></>
								)}
								{choice?.perk ? (
									<div className="modifier">
										{"Perk: " + choice?.perk}
									</div>
								) : (
									<></>
								)}
							</div>
						) : (
							<></>
						)
					)}
				</div>
			</div>
		);
	} else return <></>;
}

export default Choice;
