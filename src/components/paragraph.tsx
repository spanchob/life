import React from "react";

function Paragraph(props: { title: string; description: string[] }) {
	return (
		<div className="para">
			<div className="title">{props.title}</div>
			{props.description.map((para) => (
				<div className="paragraph">{para}</div>
			))}
		</div>
	);
}

export default Paragraph;
