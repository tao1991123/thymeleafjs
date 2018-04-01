/*
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ExpressionProcessor from '../../../src/standard/expressions/ExpressionProcessor';

/**
 * Tests for the expression processor.
 */
describe('standard/expressions/ExpressionProcessor', function() {

	describe('Variable expressions', function() {

		const context = {
			greeting: 'Good morning!',
			greetings: {
				hello: 'Hello :)',
				goodbye: 'Goodbye :(',
				goodnight: null
			}
		};

		test('Expressions get passed to underlying function', function() {
			let result;
			let expressionProcessor = new ExpressionProcessor(context);

			result = expressionProcessor.process('${greeting}');
			expect(result).toBe(context.greeting);

			result = expressionProcessor.process('${greetings.hello}');
			expect(result).toBe(context.greetings.hello);
		});

		test('null/undefined value handling', function() {
			let expressionProcessor = new ExpressionProcessor(context);
			let result = expressionProcessor.process('${greetings.goodnight}');
			expect(result).toBe('');
		});

		test('No context handling', function() {
			let expressionProcessor = new ExpressionProcessor();
			let result = expressionProcessor.process('${greeting}');
			expect(result).toBe('');
		});

	});


	describe('Literal tokens', function() {

		test('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let expressionProcessor = new ExpressionProcessor();
			let result = expressionProcessor.process(greeting);
			expect(result).toBe(greeting);
		});

	});


	describe('Fragment expressions', function() {

		test('Extracts the template and fragment name parts', function() {
			let result = processFragmentExpression('~{template :: fragment}');
			expect(result).toEqual({
				templateName: 'template',
				fragmentName: 'fragment'
			});
		});

		test('null result (fallback)', function() {
			let result = processFragmentExpression('Anything');
			expect(result).toBe(null);
		});
	});


	describe('Iteration expressions', function() {

		test('Value and local name mapping', function() {
			let items = ['a', 'b', 'c'];
			let expression = 'item: ${items}';
			let result = processIterationExpression(expression, { items });
			expect(result.localValueName).toBe('item');
			expect(result.iterable).toBe(items);
		});

		test('null result (fallback)', function() {
			let result = processIterationExpression('Anything');
			expect(result).toBe(null);
		});
	});


	describe('Link expressions', function() {
		const context = {
			greeting: 'hello'
		};

		test('Leaves URLs without special parameters alone', function() {
			let result = processLinkExpression('@{/test}');
			expect(result).toBe('/test');
		});

		test('Append special parameters', function() {
			let result = processLinkExpression('@{/test(param1=hard-coded-value,param2=${greeting})}', context);
			expect(result).toBe('/test?param1=hard-coded-value&param2=hello');
		});

		test('Replace parameters in url', function() {
			let result = processLinkExpression('@{/{part1}/{part2}/(part1=test,part2=${greeting})}', context);
			expect(result).toBe('/test/hello/');
		});

		test('Mixed template and query parameters', function() {
			let result = processLinkExpression('@{/test/{template}(template=${greeting},query=next)}', context);
			expect(result).toBe('/test/hello?query=next');
		});

		test('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let result = processLinkExpression(greeting);
			expect(result).toBe(greeting);
		});
	});

});