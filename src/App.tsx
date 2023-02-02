import React from "react";
import "./styles/life.css";
import Choice from "./components/choice";
import data from "./data/life.json";
import Paragraph from "./components/paragraph";
import { useState } from "react";
import Ending from "./components/ending";
import _ from "lodash";
import Photopara from "./components/photopara";

function App() {
	var traitsRaw: any[] = [];
	var traits: any[] = [];
	function initialStateSet(data: any[]) {
		var initialState = {};
		data.forEach((component) => {
			if (component.type === "choice" && component.choices) {
				_.set(initialState, component.title, []);
				component.choices.forEach((choice: any) => {
					if (choice.modifier !== "") {
						choice.modifier
							.match(/\b[^\d\W]+\b/g)
							.forEach((trait: string) => {
								traitsRaw.push(trait);
							});
					}

					// choice.modifier
					// 	.match(/\b[^\d\W]+\b/g)
					// 	.forEach((trait: string) => {
					// 		traitsRaw.push(trait);
					// 	});
				});
			}
		});
		traits = [...new Set(traitsRaw)];
		traits.forEach((trait) => {
			_.set(initialState, trait, 0);
		});
		return initialState;
	}

	function copyHarem() {
		var result = "";

		console.log(gameState);

		_.forIn(gameState, (member: any, role) => {
			console.log(member);
			if (typeof member !== "number" && member.length > 0) {
				result = result + role + ": ";
				member.forEach((mem: any) => {
					result = result + mem.name + ", ";
				});

				result = result + "\n";
			}
		});
		_.forIn(stateTraits, (value: any, trait) => {
			result = result + trait + ": ";
			result = result + value.toString();
			result = result + "\n";
		});

		navigator.clipboard.writeText(result);
	}

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
				if (gameState[aArray[0]] && aArray[1]) {
					a = [];
					gameState[aArray[0]].forEach((celeb: any) => {
						ayys.push(celeb[aArray[1]]);
					});
				} else if (gameState[aArray[0]]) {
					a = gameState[aArray[0]];
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

	var stateTraits = {};

	const [gameState, setGameState] = useState(initialStateSet(data.data));
	traits.forEach((trait) => {
		_.set(stateTraits, trait as string, gameState[trait]);
	});

	var values: any[] = _.values(gameState);
	var harem: any[] = [];

	values.forEach((value) => {
		if (typeof value !== "number") {
			value.forEach((val: any) => {
				var newvalue = _.cloneDeep(val);
				if (newvalue) {
					newvalue.description = "";
				}
				harem.push(newvalue);
			});
		}
	});

	console.log(gameState);

	return (
		<React.Fragment>
			<main>
				<div>
					<div className="main-title">{data.title}</div>
					<div className="paragraph">{data.description}</div>
				</div>
				{data.data.map((component: any) => {
					if (component.type === "choice" && component.choices) {
						return (
							<Choice
								key={component.title}
								title={component.title}
								choices={component.choices}
								description={component.description}
								maxChoice={component.pick}
								condition={conditionParser(component.condition)}
								state={gameState}
								setState={setGameState}
							></Choice>
						);
					} else if (
						component.type === "paragraph" &&
						typeof component.description !== "string"
					) {
						return (
							<Paragraph
								key={component.title}
								title={component.title}
								description={component.description}
							></Paragraph>
						);
					} else if (
						component.type === "photopara" &&
						typeof component.description !== "string"
					) {
						return (
							<Photopara
								key={component.title}
								title={component.title}
								condition={conditionParser(component.condition)}
								celeb={component.celeb}
								description={component.description}
							></Photopara>
						);
					} else if (
						component.type === "ending" &&
						typeof component.description === "string" &&
						component.traits &&
						component.data
					) {
						return (
							<Ending
								key={component.title}
								title={component.title}
								description={component.description}
								traits={component.traits}
								data={component.data}
								stateTraits={stateTraits}
								gameState={gameState}
								setState={setGameState}
							></Ending>
						);
					} else {
						return <></>;
					}
				})}
				<div>
					<Choice
						title="Your Harem"
						choices={harem ? harem : []}
						description={""}
						maxChoice={0}
						setState={() => {}}
						state={{}}
					/>
				</div>
				<div className="button" onClick={() => copyHarem()}>
					CLICK HERE TO COPY CHOICES
				</div>
			</main>

			<div className="traits">
				{traits.map((trait: any) => (
					<p>{trait + " : " + gameState[trait]}</p>
				))}
			</div>
		</React.Fragment>
	);
}

export default App;
