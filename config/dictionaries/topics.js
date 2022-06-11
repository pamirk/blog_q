const topicNameAbbreviations = {
	'Finance and economics': 'Finance',
	'Other topics': 'Other',
	'Politics and policy': 'Policy',
	'Science and human behavior': 'Science',
	'Tech and communications': 'Tech',
	'Work and management': 'Work',
};

export const abbreviateTopicName = name => topicNameAbbreviations[ name ] || name;
