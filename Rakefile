require 'quality/rake/task'

Quality::Rake::Task.new do |t|
  t.output_dir = 'metrics'
  t.verbose = true
  # XXX: Need to make quality defaults and config work better for JS.
  #
  # extra_files are assumed to be Ruby files, for starters
  t.extra_files = ['*.js', 'Rakefile']
  t.skip_tools = %w(rubocop reek flog flay)
end

task default: :quality
